'use strict';
/* Reproducible rate-sensitivity modification of original frozen_mixed_loadgen.js.
 * This produces a derived protocol. Keep original v1 source unchanged. */
const fs=require('fs'),path=require('path');
const f=path.resolve(process.argv[2]||'work/v1.5.1/fabric_native/client/frozen_mixed_loadgen.js');
let s=fs.readFileSync(f,'utf8');
const replacements=[
 ['function makeTrace(seed) {','function makeTrace(seed,rate) {'],
 ['for(let i=0;i<120;i++){','for(let i=0;i<(100+2*rate);i++){'],
 ["protocol:'geo-v151-frozen-mixed-v1'","protocol:'geo-v151-frozen-mixed-v2-rate-controlled'"],
 ['operations,rate:10,duration:12,warmup:2,','operations,rate,duration:2+100/rate,warmup:2,'],
 ["const traceFile=seed=>path.join(OUT,'trace_seed_'+seed+'.json');","const traceFile=(seed,rate)=>path.join(OUT,'trace_seed_'+seed+'_rate'+rate+'.json');"],
 ["const mode=spec.mode||'run',seed=Number(spec.seed);","const mode=spec.mode||'run',seed=Number(spec.seed),rate=Number(spec.rate||10);"],
 ["if(!Number.isInteger(seed)||seed<1)throw Error('Specify integer seed>=1');","if(!Number.isInteger(seed)||seed<1)throw Error('Specify integer seed>=1');\n  if(![10,20,40].includes(rate))throw Error('rate must be 10, 20, or 40');"],
 ['const tr=makeTrace(seed);','const tr=makeTrace(seed,rate);'],
 ['traceFile(seed)','traceFile(seed,rate)'],
 ['const due=t0+i*100;','const due=t0+i*(1000/rate);'],
 ['const measured=rows.filter(r=>r.i>=20);','const measured=rows.filter(r=>r.i>=tr.warmup*rate);'],
 ["if(!['gkf','gkcr'].includes(cc))throw Error('cc must be gkf or gkcr');","if(!/^gk(f|cr)(10|20|40)$/.test(cc))throw Error('cc must be gkf{rate} or gkcr{rate}');"],
 ["run_id:'frozen_'+cc+'_seed'+seed","run_id:'frozen_'+cc+'_seed'+seed+'_rate'+rate"],
 ['offered_scheduled_tps:10,','offered_scheduled_tps:rate,'],
];
for(const [a,b] of replacements){
 if(!s.includes(a))throw Error('Expected v1 template missing: '+a);
 s=s.replaceAll(a,b);
}
fs.writeFileSync(f,s);
console.log('Prepared rate-controlled mixed protocol',f);
