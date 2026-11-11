'use strict';
/**
 * Independent high-resolution sampled geohash-coverage diagnostic.
 * IMPORTANT: Sampling is NOT an interval-arithmetic proof of conservativity.
 * Any missed sample is a concrete counterexample, while zero misses is only
 * support for the tested synthetic polygon families and CRS.
 */
const assert=require('node:assert/strict'),proj4=require('proj4');
const I=require('../v1.5.1/chaincode/lib/geokhewat-contract')._internal;
const G=require('../v1.5.1/chaincode/test/support/geo_util');
proj4.defs('EPSG:32643','+proj=utm +zone=43 +datum=WGS84 +units=m +no_defs');
const B32='0123456789bcdefghjkmnpqrstuvwxyz';
function independentGeohash(lon,lat,p){
 let lo=-180,hi=180,la=-90,ha=90,ch=0,bits=0,out='';
 for(let k=0;k<p*5;k++){
   let b;
   if(k%2===0){const mid=(lo+hi)/2;b=lon>=mid?1:0;if(b)lo=mid;else hi=mid;}
   else{const mid=(la+ha)/2;b=lat>=mid?1:0;if(b)la=mid;else ha=mid;}
   ch=(ch<<1)|b;bits++;
   if(bits===5){out+=B32[ch];ch=0;bits=0;}
 }
 return out;
}
function utmLL(x,y){return proj4('EPSG:32643','EPSG:4326',[x,y]);}
function ring(points){
 const a=points.map(([x,y])=>G.ll([G.X0+x,G.Y0+y]));
 return [...a,a[0]];
}
const shapes=[
 {tag:'sliver',pts:[[0,0],[16.1,0.11],[16.2,0.46],[0,0.32]]},
 {tag:'irregular',pts:[[1,1],[9.13,0.78],[12.08,4.72],[6.32,9.84],[0.4,6.21]]},
 {tag:'diagonal',pts:[[0,0],[92,19],[90,22],[-2,3]]},
 {tag:'long-diagonal',pts:[[0,0],[1490,83],[1489,87],[-1,4]]},
];
const data={method:'independent geohash encoding and 0.2-m UTM-edge sampling',source:'original v1.5.1 claim/region cover',status:'sampled checks not formal proof',samples:0,checked_cases:0,fail_closed:0,misses:[],cases:[]};
for (const prec of [5,6,7,8,9,10]) for(const sh of shapes){
 const r=ring(sh.pts);
 const origin=I.originOf(r.slice(0,-1));
 const mm=I.mmPath(r,origin);
 const claim=I.claimOf([r],[],origin);
 assert.equal(claim.nonempty,true,sh.tag);
 let cells,claimCells;
 try {
   cells=new Set(I.regionCells(mm,origin,prec,'poly'));
   claimCells=new Set(I.claimCellsOf([claim],origin,prec,'poly'));
 }catch(e){
   assert.match(String(e.message),/exceeds|too many|spans .* refused/i);
   data.fail_closed++;data.cases.push({precision:prec,shape:sh.tag,result:'refused-on-cap',message:e.message});
   continue;
 }
 let n=0;
 for(let k=0;k<mm.length;k++){
   const a=mm[k],b=mm[(k+1)%mm.length];
   const A=[origin[0]+a.X/1000,origin[1]+a.Y/1000],B=[origin[0]+b.X/1000,origin[1]+b.Y/1000];
   const steps=Math.max(1,Math.ceil(Math.hypot(B[0]-A[0],B[1]-A[1])/0.2));
   for(let t=0;t<=steps;t++){
     const [lon,lat]=utmLL(A[0]+(B[0]-A[0])*t/steps,A[1]+(B[1]-A[1])*t/steps);
     const cell=independentGeohash(lon,lat,prec);
     if(!cells.has(cell)||!claimCells.has(cell))data.misses.push({shape:sh.tag,prec,segment:k,t,steps,cell,region:cells.has(cell),claim:claimCells.has(cell)});
     data.samples++;n++;
   }
 }
 data.checked_cases++;data.cases.push({precision:prec,shape:sh.tag,result:'sampled',samples:n,region_cells:cells.size,claim_cells:claimCells.size});
}
console.log('INDEPENDENT_COVERAGE_DIAGNOSTICS',JSON.stringify({...data,misses:data.misses.slice(0,15)}));
assert.equal(data.misses.length,0,'Counterexample: segment point mapped into an omitted claim/region cell');
assert.ok(data.checked_cases>=10);
console.log('SAMPLED_COVERAGE_NO_MISSING_CELLS (not a proof)');
