'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fresh,SH1,G,Contract}=require('../v1.5.1/chaincode/test/support/world');
const J=JSON.stringify;
function ok(r,why){assert.equal(r.ok,true,why+': '+(r.error||r.code));}
async function chain(){
  const S=await fresh('GKCR');
  ok(await S.reg('P',G.rect(0,0,60,40),'K1'),'parent');
  ok(await S.part('P',[['A',G.rect(0,0,30,40)],['B',G.rect(30,0,30,40)]]),'partition P');
  ok(await S.amal('A','B','M',G.rect(0,0,60,40)),'amalgamate');
  ok(await S.part('M',[['M1',G.rect(0,0,30,40)],['M2',G.rect(30,0,30,40)]]),'partition M');
  assert.deepEqual(S.parcel('P').successors,['A','B']);
  assert.deepEqual(S.parcel('A').successors,['M']);
  assert.deepEqual(S.parcel('B').successors,['M']);
  assert.deepEqual(S.parcel('M').successors,['M1','M2']);
  return S;
}
test('successor chain still rejects overlapping new registration before and after cell compaction',async()=>{
  const S=await chain(), probe=G.rect(38,2,1,1);
  const before=await S.reg('X',probe,'KX');
  assert.equal(before.ok,false,'Must reject an overlap on live M2');
  const cells=[...S.w.state.keys()].filter(k=>k.startsWith('CLAIM~')).map(k=>k.split('~')[2])
      .filter(g=>Contract._internal.ringMeetsCellLL(probe,g));
  assert.ok(cells.length>0,'Expected indexed cell');
  let changed=0;
  for(const g of cells){const r=await S.inv('CompactCell',[g]);if(r.ok)changed++;}
  assert.ok(changed>0,'At least one CompactCell must be accepted');
  const after=await S.reg('X',probe,'KX');
  assert.equal(after.ok,false,'Compaction must not lose live successor');
  assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
});
test('two competing claims into the same gap after multiple retirements never both commit',async()=>{
 for(const reverse of [false,true]){
   const S=await chain();
   ok(await S.reg('Q',G.rect(61.4,0,60,40),'K2'),'neighbour');
   const m=await S.end('RectifyBoundary',['M2',J(G.rect(30,0,30.95,40)),'S','[]']);
   const q=await S.end('RectifyBoundary',['Q',J(G.rect(60.7,0,60.7,40)),'S','[]']);
   assert.equal(m.ok,true,m.error);assert.equal(q.ok,true,q.error);
   const codes=S.commit(reverse?[q,m]:[m,q]);
   assert.equal(codes.filter(c=>c==='VALID').length,1,J(codes));
   assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
 }
});
test('compaction in flight with boundary claim does not create ghost parcel',async()=>{
 for(const reverse of [false,true]){
   const S=await chain();
   ok(await S.reg('Q',G.rect(61.4,0,60,40),'K2'),'neighbour');
   const strip=G.rect(60.75,0,0.65,40);
   const cells=[...S.w.state.keys()].filter(k=>k.startsWith('CLAIM~')).map(k=>k.split('~')[2])
      .filter(g=>Contract._internal.ringMeetsCellLL(strip,g));
   assert.ok(cells.length>0,'Expected claim cell for concurrent update');
   const a=await S.end('CompactCell',[cells[0]]);
   const b=await S.end('RectifyBoundary',['Q',J(G.rect(60.75,0,60.65,40)),'S','[]']);
   assert.equal(a.ok,true,a.error);assert.equal(b.ok,true,b.error);
   const codes=S.commit(reverse?[b,a]:[a,b]);
   assert.ok(codes.includes('VALID'),J(codes));
   assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
   const x=await S.reg('X',G.rect(60.9,5,0.2,1),'KX');
   assert.equal(x.ok,false,'New parcel must still be rejected in occupied boundary strip');
 }
});
