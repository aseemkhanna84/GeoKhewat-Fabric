# GeoKhewat — IJIES 20267430 reviewer revision work branch

**Research status: scientific validation in progress; not final IJIES acceptance-ready.** Original `main` remains unchanged. Research source comes from the unchanged sanitized v1.5.1 snapshot (archive SHA-256 `c0f45b10234f3fc908ed2e96ff9be2e9d70b91eb4590882c6dd8e0751dadef37`).

## Navigation

- [16 reviewer issue statuses and actual evidence](IJIES_16_COMMENT_REMEDIATION_REGISTER_2026-11-11.md)
- [Formal safety proof obligations and unexecuted multi-host plan](IJIES_FORMAL_SAFETY_AND_MULTIHOST_PROTOCOL_2026-11-11.md)
- [Source-level geometry and numeric precision](IJIES_GEOMETRY_METHODS_AUDIT_2026-11-11.md)
- [Frozen-request six-block simulator output](IJIES_FROZEN_REPLAY_RESULTS_2026-11-10.md)
- [Equal-start, one-block results and targeted adversarial checks](IJIES_EQUAL_START_SAFETY_RECONFIRM_2026-11-11.md)
- [Real Fabric 78/78 deployed current-version tests + Caliper smoke](IJIES_FABRIC3_78_TESTS_AND_CALIPER_SMOKE_2026-11-11.md)
- [Real Fabric matched 10-TPS three-pair exploratory study](IJIES_REAL_FABRIC_PAIRED_FROZEN_3SEEDS_2026-11-11.md)
- [Real Fabric load-generation pilot and restrictions](IJIES_REAL_FABRIC_LOADGEN_PILOT_2026-11-11.md)

## Newly added research-only controls

- [Independent high-resolution geohash coverage diagnostic](reviewer-revision/independent_coverage_diagnostic.js) — successful [GitHub Actions 43042061392](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43042061392): **66,848 boundary points**, **21 completed covers**, **3 safe cap refusals**, **0 observed misses**. **Not a formal proof.**
- [Derived SCAN_SAFE full-scan baseline](reviewer-revision/safe_scan_baseline_patch.js) and [targeted tests](reviewer-revision/safe_scan_baseline.test.js) — **4/4 tests passed** and matched requests for GKF, GKC, GKCR and SCAN_SAFE on a local simulator. The baseline's deliberate global serialization is not a practical locality-based concurrency solution.
- [Irregular 576-parcel shared-vertex synthetic generator](reviewer-revision/irregular_synthetic_cadastre.js) — [GitHub Actions 43043522137](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43043522137) generated 3 distinct 576-parcel GeoJSON fixtures and verified **zero positive-area overlaps** in nearby parcel pairs. They are not a real Jamabandi map or validated field distribution.
- [Rate-isolated real-Fabric 10/20/40 offered TPS workflow](.github/workflows/ijies-fabric-rates.yml) — uses separate peer-chaincode state per strategy and rate, matched SHA-256 request traces within each seed/rate. **Executed and independently audited:** [GitHub Actions run 43043266865](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43043266865). With 300 offers per strategy at each target rate, GK-CR minus GK-F commit yield was **+27.67 / +27.00 / +27.67 pp** at 10/20/40 TPS. Increased pre-submit failures and variable p95 at 40 TPS limit generalization. [Detailed audit](IJIES_REAL_FABRIC_10_20_40_TPS_AUDIT_2026-11-11.md).

## Critical unresolved scientific gates

1. The inverse-projection geohash coverage guarantee has NOT been formally established; 10-m densification plus pad and sampled tests do not supply a universal error bound.
2. Need independent trace-source counterbalance, larger field-calibrated irregular benchmarks, precise mutation+compaction safety invariant tests.
3. Single-runner three-org testing is NOT multi-host/WAN delay sensitivity; additional controlled real network tests are required to generalize.
4. Full edited IJIES manuscript with exact table/page revisions, coauthor approval, declarations, disclosure and the complete 16-point response letter remains pending. Journal resubmission timing must be confirmed.

**Reporting guard:** The older v10 state-adaptive simulator data, equal-start one-block local simulator, and three-org Fabric outcomes are separate study arms. Historical `85/85` includes seven legacy v1.3 defect reproductions; fresh v1.5.1 deployment verified **78/78**. Use **22 co-owner interests**, not parcels; history offered denominator is **40 × 64 = 2,560** per seed; the ~**3.03 m²** Bolina difference arises from decimal **truncation**, not rounding.

*No fabricated data, no patent/approval claim, no guarantee of IJIES acceptance.*
