'use strict';
const fs=require('fs'),path=require('path');
const source=path.join(__dirname,'../v1.5.1/layerb/bench_cc.js');
let content=fs.readFileSync(source,'utf8');
const needle="  const base = await baseWorld(strategy, cover || 'poly', SPEC.corpus, SPEC.theta);";
if(!content.includes(needle)) throw Error('Cannot find insertion point: stop');
content=content.replace(needle,needle+`
  const canonicalInitial = [...base.w.state.entries()].filter(([key])=>
    key.startsWith('PARCEL~')||key.startsWith('KHEWAT~'))
    .map(([key,v])=>{
      const p=JSON.parse(v.value.toString());
      return [key,key.startsWith('PARCEL~') ?
        {id:p.id,khewat:p.khewat,status:p.status,ring:p.ring,areaM2:p.areaM2,
         predecessors:p.predecessors,successors:p.successors} : {shares:p.shares}];
    }).sort((a,b)=>a[0].localeCompare(b[0]));
  const initialSha=crypto.createHash('sha256').update(JSON.stringify(canonicalInitial)).digest('hex');
`);
const marker="  rec.trace = [];";
if(!content.includes(marker)) throw Error('Cannot find record insertion point');
content=content.replace(marker,"  rec.initial_geometry_sha256 = initialSha;\n  rec.initial_parcel_count=canonicalInitial.filter(x=>x[0].startsWith('PARCEL~')).length;\n"+marker);
fs.writeFileSync(path.join(__dirname,'../v1.5.1/layerb/bench_one_block.js'),content);
console.log('Instrumented one-block benchmark with initial map ownership SHA-256.');
