# IJIES Paper 20267430 — actual three-organisation Fabric loadgen pilot

**Execution:** 11 November 2026 (UTC).  
**GitHub Actions completed successfully:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42969537345  
**Original source and per-transaction CSV artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42969537345/artifacts/13832568012

This is an **independent custom open-loop loadgen** experiment on **real native Fabric 2.5.16**, **not Hyperledger Caliper**, and it must not be combined with the separate single-round Caliper smoke test. One Raft orderer, one peer each for SurveyMSP/RevenueMSP/RegistrationMSP, LevelDB, TLS and 2-of-3 endorsement. The GitHub Actions host reported **4 logical CPUs, 16 GiB memory**. Identical geometry policy (8-character geohash, polygon cover, epsilon = 0.01 m²) and v1.5.1 code were deployed to each strategy.

## Actual measured outcomes

Workload protocol: **one repetition per combination, 12 s generated workload, first 2 s excluded as warm-up**. Offered/committed/invalid counts refer only to the measured period.

| Strategy | Workload | Target offered TPS | Offered | Committed | MVCC invalid | Endorsement refused | Committed throughput (TPS) | p95 committed end-to-end latency (ms) |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| GK-F | Disjoint registration | 10 | 100 | 100 | 0 | 0 | 10.057 | 940.66 |
| GK-F | Disjoint registration | 20 | 200 | 200 | 0 | 0 | 20.024 | 488.60 |
| GK-F | Disjoint registration | 40 | 400 | 400 | 0 | 0 | 39.946 | 267.43 |
| GK-CR | Disjoint registration | 10 | 100 | 100 | 0 | 0 | 10.063 | 936.12 |
| GK-CR | Disjoint registration | 20 | 200 | 200 | 0 | 0 | 20.026 | 486.04 |
| GK-CR | Disjoint registration | 40 | 400 | 400 | 0 | 0 | 39.927 | 267.92 |
| GK-F | Mixed updates/partitions | 10 | 100 | 65 | 34 | 1 | 5.887 | 1739.54 |
| GK-CR | Mixed updates/partitions | 10 | 100 | 88 | 12 | 0 | 8.863 | 928.85 |

All 8 audit rows passed: **offered = sum of the recorded validation codes** and **committed = count(VALID)**. No `PHANTOM_READ_CONFLICT` was observed in this small pilot. The raw per-transaction `tx/*.csv` and summary JSONL are in the linked artifact.

## Critical limitations for journal reporting

1. The two **mixed** workload streams are *not guaranteed to contain identical operations*: the `loadgen.js` generator updates its active parcel corpus after each successful commit. Because the strategies commit different subsets, subsequent requests can diverge. **Do not claim the 88/100 vs 65/100 result as a controlled causal gain or give a significance estimate.**
2. There was **only one repetition**, on one shared GitHub runner. These are illustrative pilot measurements, not a statistically supported 3-repeat or multi-host performance claim.
3. The measured throughput is successful **commits**, not the offered send rate or endorsement throughput. There is no independent ordered-block count in this pilot, although per-transaction block numbers are stored for valid statuses.
4. Disjoint registrations intentionally do not compete for cells. The 100% valid numbers at 10/20/40 TPS are therefore *not* evidence for a contention-reduction advantage.
5. p95 is based only on **committed** transactions; rejected transactions require separate latency distributions. The 2-s warm-up and test window are short. More robust real network comparisons need longer 30-s duration, at least 3 repeats, equal starting states/request traces or a predeclared adaptive design, controlled competing safe baselines, and machine-readable statistical analysis.
6. Do not substitute this pilot for the manuscript's archived `30.4 versus 23.1 TPS` values; the configurations and protocols differ.

## Next evidence gate

Pre-generate common synthetic edit traces from a declared initial map, replay against strategy-specific copies with documented rejection semantics, record offered/endorsed/ordered/invalid/valid counts, mean/p50/p95/p99 including rejected transactions, then run **three independent repetitions** with a separately measured host-resource/delay sensitivity study. Preserve raw results in a durable versioned release after privacy review.

The source workflow is `.github/workflows/ijies-fabric-loadgen-pilot.yml` in the revision branch. No source code was modified inside the v1.5.1 archive.
