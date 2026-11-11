'use strict';
/* GeoKhewat irregular synthetic cadastral corpus: NO real land-record geometry.
 * 24 x 24 shared-grid quads with jittered internal vertices.
 * Adjacent polygons use identical shared vertices. Shape is synthetic by design.
 */
const fs=require('fs'),crypto=require('crypto');
const G=require('../v1.5.1/chaincode/test/support/geo_util');
const J=JSON.stringify;
const hash=x=>crypto.createHash('sha256').update(J(x)).digest('hex');
function rng(seed){let s=seed>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/2**32;};}
function generate(seed=17,n=24){
 const next=rng(seed),dx=42,dy=33,amp=3.2,vertices=[];
 for(let y=0;y<=n;y++){vertices[y]=[];for(let x=0;x<=n;x++){
   const u=(x===0||x===n)?0:(next()-0.5)*2*amp;
   const v=(y===0||y===n)?0:(next()-0.5)*2*amp;
   vertices[y][x]=[x*dx+u,y*dy+v];
 }}
 function orient(a,b,c){return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);}
 const features=[];
 for(let y=0;y<n;y++)for(let x=0;x<n;x++){
   const pts=[vertices[y][x],vertices[y][x+1],vertices[y+1][x+1],vertices[y+1][x]];
   for(let i=0;i<4;i++)if(orient(pts[i],pts[(i+1)%4],pts[(i+2)%4])<=0)throw Error('Non-convex/inverted quad '+x+','+y);
   const ring=pts.map(p=>G.ll([G.X0+p[0],G.Y0+p[1]]));ring.push([...ring[0]]);
   features.push({type:'Feature',properties:{parcel_id:'SYN'+seed+'_'+y+'_'+x,source:'synthetic_shared_vertex_jitter',seed},geometry:{type:'Polygon',coordinates:[ring]}});
 }
 return {type:'FeatureCollection',properties:{description:'Synthetic irregular quad tessellation only, NOT actual cadastral land data',CRS:'EPSG:4326',seed,grid:n,sha256:hash(features)},features};
}
function bbox(pts){let x=pts.map(p=>p[0]),y=pts.map(p=>p[1]);return [Math.min(...x),Math.min(...y),Math.max(...x),Math.max(...y)];}
function verify(c){
 const f=c.features,boxes=f.map(x=>bbox(x.geometry.coordinates[0].slice(0,-1).map(G.utm)));
 let tested=0,maxOverlap=0,overEps=0;
 for(let a=0;a<f.length;a++)for(let b=a+1;b<f.length;b++){
   const A=boxes[a],B=boxes[b];if(A[2]<B[0]-0.0005||B[2]<A[0]-0.0005||A[3]<B[1]-0.0005||B[3]<A[1]-0.0005)continue;
   const m=G.overlapM2(f[a].geometry.coordinates[0],f[b].geometry.coordinates[0]);
   tested++;maxOverlap=Math.max(maxOverlap,m);if(m>0.010000001)overEps++;
 }
 if(f.length!==576)throw Error('Expected 576 parcels, got '+f.length);
 if(overEps)throw Error('Irregular corpus has '+overEps+' pairs above epsilon; max overlap '+maxOverlap);
 return {features:f.length,nearby_pairs_tested:tested,max_overlap_m2:maxOverlap,pairs_over_eps:overEps,sha256:c.properties.sha256};
}
if(require.main===module){
 const s=Number(process.argv[2]||17),file=process.argv[3];
 const c=generate(s),summary=verify(c);
 if(file)fs.writeFileSync(file,J(c)+'\n');
 console.log('IRREGULAR_SYNTHETIC_CORPUS',J(summary));
}
module.exports={generate,verify};
