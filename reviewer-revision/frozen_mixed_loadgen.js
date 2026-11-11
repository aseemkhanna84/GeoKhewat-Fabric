'use strict';
// Frozen synthetic-request protocol for IJIES reviewer validation.
// This is a new experiment. It does not replace archived state-adaptive results.
const fs=require('fs'), path=require('path'), os=require('os'), crypto=require('crypto');
const {gateway,evaluate,closeAll,CODE}=require('./gw');
const G=require('./geo_util');
const spec=JSON.parse(process.argv[2] || '{}');
const NET=path.resolve(__dirname,'..');
const OUT=path.join(NET,'results','frozen_reviewer');
fs.mkdirSync(OUT,{recursive:true});
const J=JSON.stringify, sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const hash=o=>crypto.createHash('sha256').update(J(o)).digest('hex');
const SH='[{"owner":"O1","num":"1","den":"1"}]';
function rand(seed) { let s=seed>>>0; return ()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296;};}
function name(seed,r,c){return 'FR'+seed+'_'+r+'_'+c;}
function fixtures(seed){
  const x=-185000+seed*700,y=-80000;
  const parcels=[];
  for(let r=0;r<8;r++) for(let c=0;c<8;c++){
    const px=x+c*30,py=y+r*44;
    parcels.push({id:name(seed,r,c),x:px,y:py,ring:G.rect(px,py,30,40)});
  }
  return parcels;
}
function makeTrace(seed) {
  const rnd=rand(512384+seed*9001);
  const parcels=fixtures(seed);
  const operations=[];
  for(let i=0;i<120;i++){
    if(i%6===0){
      const p=parcels[16+Math.floor(i/6)],left=12.3,right=17.7;
      const kids=[
        {khasra:p.id+'_A',ring:G.rect(p.x,p.y,left,40),shares:JSON.parse(SH)},
        {khasra:p.id+'_B',ring:G.rect(p.x+left,p.y,right,40),shares:JSON.parse(SH)}
      ];
      operations.push({i,fn:'PartitionParcel',args:[p.id,J(kids),'[]']});
    } else {
      // Deterministic hot subset, with no partitions targeting these parcels.
      const idx=rnd()<0.75?Math.floor(rnd()*16):36+Math.floor(rnd()*28);
      const p=parcels[idx],d=0.10+Math.round(rnd()*250)/1000;
      let x=p.x,y=p.y,w=30,h=40;
      const edge=Math.floor(rnd()*4);
      if(edge===0){x+=d;w-=d;}
      else if(edge===1)w-=d;
      else if(edge===2){y+=d;h-=d;}
      else h-=d;
      operations.push({i,fn:'RectifyBoundary',args:[p.id,J(G.rect(x,y,w,h)),'LOADGEN','[]']});
    }
  }
  return {protocol:'geo-v151-frozen-mixed-v1',seed,initialParcels:parcels.map(p=>({id:p.id,ring:p.ring})),
          operations,rate:10,duration:12,warmup:2,
          trace_sha256:hash(operations),initial_fixture_sha256:hash(parcels.map(p=>({id:p.id,ring:p.ring})))};
}
const traceFile=seed=>path.join(OUT,'trace_seed_'+seed+'.json');
function p50p95(a,q){if(!a.length)return null;const b=a.slice().sort((x,y)=>x-y);return b[Math.min(b.length-1,Math.round((b.length-1)*q))];}
function stats(a){return {count:a.length,mean:a.length?a.reduce((u,v)=>u+v,0)/a.length:null,
  p50:p50p95(a,.5),p95:p50p95(a,.95),p99:p50p95(a,.99)};}
function cpuSample(){
  const r={};
  for(const key of ['orderer','peer-survey','peer-revenue','peer-registration']){
    try {
      const pid=Number(fs.readFileSync(path.join(NET,'data',key+'.pid'),'utf8').trim());
      const f=fs.readFileSync('/proc/'+pid+'/stat','utf8').split(') ')[1].split(' ');
      const rss=fs.readFileSync('/proc/'+pid+'/status','utf8').match(/VmRSS:\s+(\d+)/);
      r[key]={cpu_ticks:Number(f[11])+Number(f[12]),rss_mb:rss?Number(rss[1])/1024:null};
    }catch(e){r[key]=null;}
  }
  return r;
}
async function tx(contract,operation){
  const out={i:operation.i,fn:operation.fn,code:'ERROR',endorse_ms:null,submit_ms:null,latency_ms:null,
    submitted:false,status_observed:false,block:null,t0:Date.now()};
  const start=process.hrtime.bigint();
  try {
    const prop=contract.newProposal(operation.fn,{arguments:operation.args.map(String)});
    const endorsed=await prop.endorse();
    out.endorse_ms=Number(process.hrtime.bigint()-start)/1e6;
    out.endorsed=true;
    const commit=await endorsed.submit();
    out.submitted=true;
    const status=await commit.getStatus();
    out.status_observed=true;
    out.code=CODE[status.code]||('UNKNOWN_'+status.code);
    out.block=Number(status.blockNumber);
    out.txid=prop.getTransactionId();
  } catch(e) {
    out.endorsed=out.endorsed||false;
    out.code=out.endorsed?'SUBMIT_OR_STATUS_ERROR':'ENDORSEMENT_REFUSED';
    out.error_category=(e?.name||'Error').slice(0,70);
  }
  out.latency_ms=Number(process.hrtime.bigint()-start)/1e6;
  return out;
}
async function main(){
  const mode=spec.mode||'run',seed=Number(spec.seed);
  if(!Number.isInteger(seed)||seed<1)throw Error('Specify integer seed>=1');
  if(mode==='prepare'){
    const tr=makeTrace(seed);
    fs.writeFileSync(traceFile(seed),J(tr)+'\n');
    console.log('PREPARED',traceFile(seed),'HASH',tr.trace_sha256,'COUNT',tr.operations.length);
    return;
  }
  if(mode!=='run')throw Error('Unknown mode');
  const cc=spec.cc;
  if(!['gkf','gkcr'].includes(cc))throw Error('cc must be gkf or gkcr');
  const tr=JSON.parse(fs.readFileSync(traceFile(seed),'utf8'));
  if(tr.trace_sha256!==hash(tr.operations)||tr.initial_fixture_sha256!==hash(tr.initialParcels))
    throw Error('Frozen input checksum mismatch');
  const g=gateway('survey'), contract=g.getNetwork('landrecords').getContract(cc);
  try{
    const todo=new Set(tr.initialParcels.map(p=>p.id));
    const map=new Map(tr.initialParcels.map(p=>[p.id,p]));
    let initialAttempts=0;
    for(let round=0;round<120&&todo.size;round++){
      const arr=[...todo].map(id=>map.get(id));
      const responses=await Promise.all(arr.map(p=>tx(contract,{i:-1,fn:'RegisterParcel',
        args:[p.id,'K'+p.id,J(p.ring),SH,'SYNTHETIC','[]']})));
      initialAttempts+=responses.length;
      arr.forEach((p,i)=>{if(responses[i].code==='VALID')todo.delete(p.id);});
      if(todo.size)await sleep(90);
    }
    if(todo.size)throw Error('Initial corpus not fully committed: '+todo.size+' parcels');
    const observed=[];
    for(const p of tr.initialParcels){
      const r=await evaluate(contract,'QueryParcel',[p.id]);
      if(!r.ok)throw Error('Initial parcel query failed: '+p.id);
      const v=JSON.parse(r.out);
      observed.push({id:v.id,ring:v.ring,status:v.status});
    }
    const initial_sha256=hash(observed);
    const t0=Date.now()+250,actions=[],resourcesStart=cpuSample();
    for(let i=0;i<tr.operations.length;i++){
      const due=t0+i*100;
      if(Date.now()<due)await sleep(due-Date.now());
      const op=tr.operations[i];
      actions.push(tx(contract,op).then(r=>{r.scheduled_ms=due;return r;}));
    }
    const rows=await Promise.all(actions),end=Date.now(),resourcesEnd=cpuSample();
    const afterWarm=t0+tr.warmup*1000;
    const measured=rows.filter(r=>r.i>=20);
    if(measured.length!==100)throw Error('Measured denominator is not 100');
    const codes={};
    for(const r of measured)codes[r.code]=(codes[r.code]||0)+1;
    const committed=codes.VALID||0;
    const validated=measured.filter(x=>x.status_observed);
    const validRows=measured.filter(x=>x.code==='VALID');
    const invalidRows=measured.filter(x=>x.code!=='VALID');
    const summary={
      protocol:tr.protocol,run_id:'frozen_'+cc+'_seed'+seed,seed,cc,
      network:'Fabric 2.5.16 native three-org single runner, one Raft orderer',
      trace_sha256:tr.trace_sha256,initial_fixture_sha256:tr.initial_fixture_sha256,
      observed_initial_state_sha256:initial_sha256,initial_parcels:observed.length,
      seed_setup_attempts:initialAttempts,offered:measured.length,offered_scheduled_tps:10,
      submitted:measured.filter(x=>x.submitted).length,
      status_observed:validated.length,
      ordered_status_observed:validated.filter(x=>x.block!==null&&Number.isFinite(x.block)).length,
      committed,codes,
      wall_seconds:(end-t0)/1000,
      valid_throughput_tps:committed/((end-afterWarm)/1000),
      latency_valid_ms:stats(validRows.map(x=>x.latency_ms)),
      latency_nonvalid_ms:stats(invalidRows.map(x=>x.latency_ms)),
      endorsement_latency_ms:stats(measured.filter(x=>x.endorse_ms!==null).map(x=>x.endorse_ms)),
      resources_start:resourcesStart,resources_end:resourcesEnd,runner_cpus:os.cpus().length,
      runner_mem_gb:os.totalmem()/2**30
    };
    if(Object.values(codes).reduce((a,b)=>a+b,0)!==summary.offered)throw Error('Accounting failure');
    const outputFile=path.join(OUT,summary.run_id+'.json');
    fs.writeFileSync(outputFile,J(summary)+'\n');
    const csv=['i,fn,code,scheduled_ms,t0_ms,endorse_ms,latency_ms,submitted,status_observed,block'];
    for(const r of rows)csv.push([r.i,r.fn,r.code,r.scheduled_ms,r.t0,r.endorse_ms??'',r.latency_ms,
      Number(r.submitted),Number(r.status_observed),r.block??''].join(','));
    fs.writeFileSync(path.join(OUT,summary.run_id+'.csv'),csv.join('\n')+'\n');
    console.log('FROZEN_REAL_FABRIC',J({run:summary.run_id,trace:tr.trace_sha256,initial:initial_sha256,
      offered:summary.offered,submitted:summary.submitted,ordered:summary.ordered_status_observed,
      committed:summary.committed,codes:summary.codes,valid_p95_ms:summary.latency_valid_ms.p95,
      nonvalid_p95_ms:summary.latency_nonvalid_ms.p95}));
  }finally{closeAll();}
}
main().catch(e=>{console.error('FROZEN_PROTOCOL_FAILED',e.stack||String(e));process.exitCode=1;});
