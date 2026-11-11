'use strict';
/**
 * Reviewer comparator: independent full-scan, globally serializing safety baseline.
 *
 * Derived from unchanged GeoKhewat v1.5.1; DO NOT label it original 1.5.1 code.
 * It scans ALL active PARCEL records, computes exact polygon overlaps, and writes a
 * globally shared epoch on every spatial update to prevent concurrent unsafe commits.
 * This is deliberately conservative and slow; useful as a safety reference only.
 */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const cwd=process.cwd();
const f=path.resolve(cwd,process.argv[2]||'work/v1.5.1/chaincode/lib/geokhewat-contract.js');
let s=fs.readFileSync(f,'utf8');
const oldList="const STRATEGIES = ['B1', 'B2', 'B3', 'GKF', 'GKC', 'GKCR'];";
if(!s.includes(oldList))throw Error('Unexpected chaincode version; patch refused');
s=s.replace(oldList,"const STRATEGIES = ['B1', 'B2', 'B3', 'GKF', 'GKC', 'GKCR', 'SCAN_SAFE'];");
const before="    if (cfg.strategy === 'B1') return;";
if(!s.includes(before))throw Error('Expected spatial gate absent; patch refused');
const code=`    if (cfg.strategy === 'SCAN_SAFE') {
      // Full active-state range scan; indexed geohash candidate generation not used.
      // Exact overlap check acts as the independent safety reference.
      const candidates = [];
      const it = await ctx.stub.getStateByRange('PARCEL~', 'PARCEL~\\uffff');
      try {
        for (;;) {
          const r = await it.next();
          if (!r || r.done) break;
          if (!r.value || !r.value.value) continue;
          const q = asJson(r.value.value);
          if (q && q.status === 'ACTIVE' && !exclude.has(q.id)) candidates.push(q);
        }
      } finally { if (it && typeof it.close === 'function') await it.close(); }
      wholeRingCheck(candidates);
      // Every spatial update changes the same key. MVCC serializes concurrent
      // endorsed updates, including two allocations of a formerly unowned area.
      const epoch = (await readObj(ctx, KEY_GLOBAL)) || { epoch: 0 };
      epoch.epoch += 1;
      await writeObj(ctx, KEY_GLOBAL, epoch);
      return;
    }
`;
s=s.replace(before,code+before);
fs.writeFileSync(f,s);
console.log('SCAN_SAFE patch SHA-256',crypto.createHash('sha256').update(s).digest('hex'));
