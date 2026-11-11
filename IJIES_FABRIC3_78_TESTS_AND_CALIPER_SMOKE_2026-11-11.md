# IJIES Paper 20267430 — verified three-organisation Fabric evidence

**Execution date:** 11 November 2026 (UTC)  
**GitHub Actions job:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42967800999  
**Exact branch/commit:** `ijies-reviewer-revision-2026-11-10`, `36d9da2440e2c416de746c4b93151036ea478e75`  
**Original result artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42967800999/artifacts/13831839305

## Actual executed configuration
- Native Hyperledger Fabric **2.5.16**, one Raft orderer, **three peers** for **SurveyMSP / RevenueMSP / RegistrationMSP**, TLS, GoLevelDB, **2-of-3 majority endorsement**.
- Original GeoKhewat **v1.5.1** source was taken from the sanitized and hash-verified research archive, deployed by chaincode-as-a-service. Fresh MSP/TLS certificates were generated for each ephemeral CI environment, not committed or published.
- Three-organisation synthetic parcel registration, cross-organisation queries and deployment of experimental strategies `gkcr`, `gkc`, `gkf`, `b3`, `b2`, `gkcrsbe` and `gkcrbox` completed.
- **Current-version deployed regression cases:** **78 executed, 78 passed, 0 failed**. Breakdown from `fabric-v151-results.json`: GKCR 28; GKC 22; GKF 22; GKCR-SBE 5; GKCR-box/GKCR comparison 1.
- **Why archived records reported 85/85:** the archived final JSON had these same **78 current-version case IDs** *plus seven separate legacy v1.3 defect-reproduction cases*. No deployed v1.3 source was in the sanitized public archive, so those seven were explicitly excluded from this fresh run. We matched the two case-ID sets: exactly seven archived-only legacy cases; zero new-only current cases.
- Audited result JSON SHA256: `7e0788fbdb0ff1bea3570a26885a6d5cc780ea8900813125b8e69186c95e39b7`. This matches the preserved results checksum.
- **Caliper 0.6.0** one-round **GKCR synthetic registration smoke**, *fixed offered target 4 TPS, test duration 5 s, one worker*: **21 successful**, **0 failed**, measured **send rate 4.2 TPS**, **committed throughput 3.2 TPS**, **mean latency 1.19 s**, **min 0.05 s**, **max 2.11 s**. Caliper generated an HTML report. It completed **one** round successfully.

## Scientific interpretation and limits
1. The **78/78** result is evidence for the specified suite on an ephemeral real Fabric three-organisation network, not a mathematical proof of every possible spatial schedule.
2. The **4 TPS smoke** is not the reviewer-requested multiple-rate/repetition comparison, nor the contended-edit throughput or p95 latency distribution. It should **not** be compared directly with the separate archived `30.4 vs 23.1 TPS` measurements.
3. Correctness and performance measurements must not be combined under one denominator: passing cases, submitted Caliper transactions, successful commits and any MVCC invalidations are separate metrics.
4. Still required: replay of controlled high-contention mixed edits, **three repeats** at multiple load rates, latency distributions (including p95), offered/endorsed/ordered/valid/mvcc counts, host CPU/memory and run/warm-up conditions; a properly justified safe conflict-control comparator; independent conservative geohash-coverage verification.
5. No official IJIES review recommendation is implied by these results. Manuscript and point-by-point response must be updated **after** complete audit.

**Reproducibility:** GitHub workflow `.github/workflows/ijies-fabric3-bootstrap.yml`, sanitized archive `research-artifacts/GeoKhewat_v1.5.1_Reviewer_Sanitized_Source_10Nov2026.zip`, original per-test `fabric-v151-results.json`, `fabric-v151-test-stdout.txt`, `caliper-smoke.log`, `caliper-smoke.html` and generated Caliper `package-lock.json` are all preserved in the linked artifact.
