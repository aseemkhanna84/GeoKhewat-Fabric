'use strict';
// Network smoke only; verifies genuine ledger commits, not 85-case performance.
const assert=require('node:assert/strict'),path=require('node:path');
const net=process.argv[2];
if(!net)throw new Error('Usage: node fabric_3org_smoke.js ABSOLUTE_NET_ROOT');
const gatewayHelpers=require(path.join(net,'client','gw.js'));
const G=require(path.join(net,'client','geo_util.js'));
const J=JSON.stringify;
const shares=J([{owner:'O1',num:'1',den:'1'}]);
(async()=>{
  try{
    const survey=gatewayHelpers.gateway('survey');
    const revenue=gatewayHelpers.gateway('revenue');
    const registration=gatewayHelpers.gateway('registration');
    const names=['SurveyMSP','RevenueMSP','RegistrationMSP'];
    const contracts=[survey,revenue,registration].map(g=>g.getNetwork('landrecords').getContract('gkcr'));
    console.log('Configured member orgs:',names.join(','));
    const ring=G.rect(1000,1000,20,20);
    const submitted=await gatewayHelpers.invoke(contracts[0],'RegisterParcel',['RUNNER-P001','K1',J(ring),shares,'SYNTHETIC','[]']);
    console.log('register commit',J(submitted));
    assert.equal(submitted.code,'VALID','Registration must be committed and valid on the actual Fabric ledger');
    for(let i=0;i<contracts.length;i++){
      const read=await gatewayHelpers.evaluate(contracts[i],'QueryParcel',['RUNNER-P001']);
      assert.equal(read.ok,true,'Organization '+names[i]+' must read committed parcel: '+J(read));
      const p=JSON.parse(read.out);
      assert.equal(p.id,'RUNNER-P001');
      console.log('READ_FROM_'+names[i]+'=PASS');
    }
    const conflict=await gatewayHelpers.invoke(contracts[2],'RegisterParcel',[
      'RUNNER-P002','K2',J(G.rect(1001,1001,5,5)),shares,'SYNTHETIC','[]'
    ]);
    console.log('conflicting-registration response',J(conflict));
    assert.notEqual(conflict.code,'VALID','Overlapping new registration must not be accepted');
    console.log('REAL_FABRIC_THREE_ORG_SMOKE=PASS');
  }finally{gatewayHelpers.closeAll()}
})().catch(e=>{console.error(e.stack||String(e));process.exitCode=1});
