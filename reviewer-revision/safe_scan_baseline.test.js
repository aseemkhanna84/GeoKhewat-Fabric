'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {fresh,SH1,G,ID}=require('../v1.5.1/chaincode/test/support/world');
const J=JSON.stringify;
test('SCAN_SAFE rejects overlaps without supplied neighbour IDs',async()=>{
 const S=await fresh('SCAN_SAFE');
 const a=await S.reg('A',G.rect(0,0,30,30));
 assert.equal(a.ok,true,a.error);
 const b=await S.reg('B',G.rect(10,10,30,30));
 assert.equal(b.ok,false,'Global scan must detect overlapping parcel B without neighbours');
});
test('SCAN_SAFE allows released land while still rejecting active overlap',async()=>{
 const S=await fresh('SCAN_SAFE');
 assert.equal((await S.reg('A',G.rect(0,0,30,30))).ok,true);
 assert.equal((await S.rect('A',G.rect(0,0,20,30))).ok,true);
 assert.equal((await S.reg('B',G.rect(21,0,8,30))).ok,true,'Released land is unoccupied');
 assert.equal((await S.reg('C',G.rect(18,0,5,30))).ok,false,'Live A/B still protected');
 assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
});
test('SCAN_SAFE globally serializes concurrent disjoint writes',async()=>{
 const S=await fresh('SCAN_SAFE');
 const args=(id,x)=>[id,'K'+id,J(G.rect(x,0,20,20)),SH1,'SYNTHETIC','[]'];
 const a=await S.end('RegisterParcel',args('A',0)),b=await S.end('RegisterParcel',args('B',30));
 assert.equal(a.ok,true,a.error);assert.equal(b.ok,true,b.error);
 const codes=S.commit([a,b]);
 assert.deepEqual(codes,['VALID','MVCC_READ_CONFLICT']);
 assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
});
test('SCAN_SAFE rejects two concurrent overlapping registrations at commit',async()=>{
 const S=await fresh('SCAN_SAFE');
 const args=(id,x)=>[id,'K'+id,J(G.rect(x,0,20,20)),SH1,'SYNTHETIC','[]'];
 const a=await S.end('RegisterParcel',args('A',0)),b=await S.end('RegisterParcel',args('B',10));
 assert.equal(a.ok,true,a.error);assert.equal(b.ok,true,b.error);
 const codes=S.commit([a,b]);
 assert.deepEqual(codes,['VALID','MVCC_READ_CONFLICT']);
 assert.ok(G.maxPairOverlap(S.w).area<=0.010000001);
});
