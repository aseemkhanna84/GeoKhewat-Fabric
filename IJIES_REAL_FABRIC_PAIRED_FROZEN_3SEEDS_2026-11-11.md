# IJIES 20267430 — three paired frozen-request mixed workloads on real Fabric

**Executed:** 11 November 2026  
**Successful GitHub Actions:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025  
**Original machine-readable artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025/artifacts/13839367098  
**Protocol source:** `reviewer-revision/frozen_mixed_loadgen.js` and `.github/workflows/ijies-fabric-frozen-3repeat.yml`

### Method
Real native Hyperledger Fabric 2.5.16 with SurveyMSP, RevenueMSP and RegistrationMSP on **one shared GitHub Actions runner**; two independent chaincodes GK-F and GK-CR using the **same v1.5.1 source**, eight-character geohash, polygon coverage and epsilon 0.01 m². For each of three seeds (17, 23, 29), create the same 64-parcel synthetic corpus, precompute **120 fixed mixed transactions**, offer 10 transactions/s, exclude the first 2 seconds as warm-up, and compare **100 measured proposals per chaincode**. Strategy execution order alternates across runs.

For every seed, the recorded SHA-256 for *both* immutable request traces and the *observed initial ledger parcel geometry* matched exactly across GK-F and GK-CR. All **600** measured proposals were submitted, ordered and returned a validation status. No endorsement refusals. Counts independently confirmed against per-transaction CSV.

| Seed | GK-F commits / 100 | GK-F MVCC invalid | GK-CR commits / 100 | GK-CR MVCC invalid | Paired difference (percentage points) |
|---:|---:|---:|---:|---:|---:|
| 17 | 54 | 46 | 86 | 14 | +32 |
| 23 | 55 | 45 | 79 | 21 | +24 |
| 29 | 57 | 43 | 84 | 16 | +27 |
| **Total** | **166 / 300** | **134** | **249 / 300** | **51** | **+27.67 mean pp** |

**Commit yield:** 55.33% GK-F versus 83.00% GK-CR. Mean paired improvement **27.67 percentage points** (n=3, exploratory paired t interval **17.63 to 37.71 pp**). Mean committed throughput across three runs: GK-F **5.56 TPS**, GK-CR **8.35 TPS**. Mean of run-level p95 valid-commit latencies: GK-F **949.9 ms**, GK-CR **939.0 ms**. These p95 values are not a latency distribution across all transaction outcomes; nonvalid transaction latency is recorded separately in the JSON outputs.

### Interpretation, methodological restrictions
- Fixed requests and equal starting geometries address Reviewer 1's concern about comparing *different submitted request streams*. However, the different sets of committed transactions cause **later world states to diverge**, so this experiment does **not** prove that all observed improvement is due to removal of false cell conflicts.
- n=3 seed pairs, short 12-second windows, one shared runner, sequential strategy execution. These exploratory results do **not** constitute multi-host sensitivity or robust statistical validation.
- A plain 4-TPS Caliper smoke and archived six-block adaptive-state experiments have different configurations. **Do not merge their throughput or gain percentages** with this experiment.
- Exact coverage/densification conservativity, independent safe predicate-protected comparator, fine-grained read/write maintenance costs and multi-host tests remain open.
- No fabricated results or acceptance claim: the journal reviewer response and revised paper must explicitly label the protocol, uncertainties and remaining evidence gaps.

A separate local audit of the artifact verified each of six summary JSON files against its **120-row** transaction CSV, calculated all three paired differences, and confirmed exact trace hashes and starting-ledger hashes for each pair.
