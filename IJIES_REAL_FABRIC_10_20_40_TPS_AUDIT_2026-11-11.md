# IJIES 20267430 — audited real Fabric 10/20/40 offered TPS rate sweep

**Execution date:** 11 November 2026. **Run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43043266865  
**Original machine-readable artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43043266865/artifacts/13867016391  
**Artifact SHA-256:** `7fea9d9e59c404ae4699717a4c02c5085318ca4b5651e4220c740d2395417ba7`  
**Workflow:** `.github/workflows/ijies-fabric-rates.yml`  
**Derived load-generator patch:** `reviewer-revision/derive_rate_controlled_fabric.js`

## Protocol and execution scope

- Real native Fabric **2.5.16**, SurveyMSP / RevenueMSP / RegistrationMSP with TLS, one Raft orderer, majority 2-of-3 endorsement. **All components reside on one GitHub Actions runner, NOT multi-host.**
- Original v1.5.1 code from unchanged SHA-verified source archive. Separate chaincode namespaces `gkf10/gkcr10`, `gkf20/gkcr20`, `gkf40/gkcr40` isolate mutable ledgers across rates.
- Three paired seeds **17, 23, 29** per rate. 2-second offered warm-up (20/40/80 warm-up proposals respectively), followed by exactly **100 measured offered proposals** per strategy/seed/rate, open-loop nominal **10/20/40 offered TPS**. Total **18 experiments** and **1,800 measured offers**.
- Within each of nine (rate,seed) pairs, the full immutable operation-trace SHA-256 and observed initial ledger state SHA-256 matched. Strategy order was counterbalanced by seed, but not fully randomized.
- Independent after-run audit re-read **18 original JSON summaries, 18 per-transaction CSVs and nine source traces**; checked 100 measured offers and status-code accounting, submitted/ordered/valid counts, effective p95 computation, trace hashes and initial-state equality. No results were fabricated or manually substituted.

## Validity and contention (denominator: 300 offered per rate per strategy)

| Target offered rate | Strategy | Offered | Submitted / ordered | Valid commits | MVCC invalid | Pre-submit failures* | Commit yield | Mean run committed TPS |
|---:|---|---:|---:|---:|---:|---:|---:|---:|
| 10 TPS | GK-F | 300 | 300 | 166 | 134 | 0 | 55.33% | 5.54 |
| 10 TPS | GK-CR | 300 | 300 | 249 | 51 | 0 | 83.00% | 8.35 |
| 20 TPS | GK-F | 300 | 295 | 159 | 136 | 5 | 53.00% | 8.80 |
| 20 TPS | GK-CR | 300 | 295 | 240 | 55 | 5 | 80.00% | 13.44 |
| 40 TPS | GK-F | 300 | 262 | 133 | 129 | 38 | 44.33% | 14.73 |
| 40 TPS | GK-CR | 300 | 275 | 216 | 59 | 25 | 72.00% | 16.45 |

*In the experiment code, all failures occurring before a successful endorsement are grouped under `ENDORSEMENT_REFUSED`; some may be client/network submission/timeout errors rather than policy refusal. Treat this column as **pre-submit/endorsement-stage failures** until their error categories are audited. Do not equate the target *offered* rate with measured *committed throughput*. Mean run throughput is descriptive averaging of three trial-level throughput values; not a pooled wall-clock throughput.

**Paired GK-CR minus GK-F commit-yield differences:** 10 TPS seeds: **+32, +24, +27** pp (mean **+27.67 pp**); 20 TPS: **+34, +21, +26** pp (mean **+27.00 pp**); 40 TPS: **+25, +25, +33** pp (mean **+27.67 pp**). Each seed had 100 measured offers per strategy. With only three paired repetitions, these differences are exploratory and should not be generalized with narrow confidence intervals.

## Latency caution

Valid-commit p95 end-to-end latencies vary markedly across seeds, particularly at 20/40 TPS: GK-F p95 ms at 40 TPS = **2000.6, 336.4, 315.2**; GK-CR = **1941.7, 1978.0, 297.4**. These are *not* consensus-only delay, and nonvalid transaction latency must be reported separately. The short 2–10-s measured windows (100/rate) and single shared host can amplify scheduling, warm-up and transient resource effects. They are unsuitable for a claim of robust lower p95 latency.

## Reviewer-facing interpretation

The matched-request design and separate ledger namespaces address the **offered-request** and initial-state comparability weakness, but different committed histories remain an inherent strategy-dependent downstream effect. The experiment supports a claim of **higher observed valid commit yield for GK-CR than GK-F in this small, single-runner synthetic protocol** across three target rates. It does **not** demonstrate general multi-host throughput dominance, geographic WAN latency robustness, exact geometric coverage proof, field-data fidelity, or a formal safety theorem.

Further requirements: derive expected errors from independent field-based parcel shape distributions, rerun ≥30-s measured windows over ≥5 independent seeds on separate hosts, change network delay in a controlled lab, verify all P1–P6 proof obligations, and prepare a complete IJIES response with page references and confirmed author declarations. The comparator `SCAN_SAFE` is a **separate locally tested safety-reference variant** and is not included in this network rate sweep.

**Related evidence:** [16-comment remediation register](IJIES_16_COMMENT_REMEDIATION_REGISTER_2026-11-11.md) · [Formal safety and multi-host plan](IJIES_FORMAL_SAFETY_AND_MULTIHOST_PROTOCOL_2026-11-11.md).
