# GeoKhewat — IJIES 20267430 reviewer remediation register (11 Nov 2026)

**Status:** Revision in progress. Reviewer comment indices below are an **issue-tracking paraphrase**, not a reproduction of the editor's exact wording. Obtain/verify the original form before sending the final point-by-point letter. All results have explicit provenance and protocol names.

## Provenance

- Unmodified archived chaincode **GeoKhewat v1.5.1** is preserved in the sanitized public ZIP; source SHA-256 `c0f45b10234f3fc908ed2e96ff9be2e9d70b91eb4590882c6dd8e0751dadef37`.
- Exact original suite: **44/44** local; **78/78** current-version deployed three-org Fabric 2.5.16 cases. Seven archived v1.3 defect reproductions are **not** current v1.5.1 deployed tests: do **not** conflate 78/78 with historical 85/85.
- Source [three-org network test](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42967800999), [three paired real-Fabric traces](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025), and [equal-start one-block test](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43037795097).
- New [independent geohash sampling and SCAN_SAFE comparator](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43042061392): 66,848 boundary sample points; 21 completed coverage cases across precisions 5–10; **0 observed misses**; 3 larger cases rejected at cap instead of silently truncated. This is **not** a completeness or projection-error proof. Four exact global scan safety cases passed.
- New `SCAN_SAFE` was generated from a **derived research-only code variant**, not original v1.5.1. Its global key and full active-parcel range scan intentionally serialize all spatial writes; the 16 local comparison runs illustrate a much lower commit yield at contention. Therefore it is a safety reference, **not** a high-throughput practical alternative.
- Real-Fabric mixed workload at 10 offered TPS, three paired seeds: GK-F **166/300** valid, GK-CR **249/300** valid, paired advantage **27.67 pp**; one shared runner, 12-second windows with 2-second warm-up, exploratory only. Not a controlled multi-host claim.
- New experimental rate sensitivity workflow `.github/workflows/ijies-fabric-rates.yml` is a separate attempt for **10, 20, 40 offered TPS**, using isolated chaincode state per rate/strategy. **Successful and independently checked:** [run 43043266865](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43043266865), 18 JSON summaries, 18 transaction CSVs and nine fixed traces. Each paired rate/seed starts from matched state and immutable offered operations. See [audited outcomes and limitations](IJIES_REAL_FABRIC_10_20_40_TPS_AUDIT_2026-11-11.md). No multi-host inference.

## Reviewer issue-by-issue gates

| Comment | Issue paraphrase | Evidence / action | Scientific status |
|---|---|---|---|
| 1 | Complete operation/lineage/compaction algorithm | Source code v1.5.1, draft pseudocode in original starter package, targeted successor-compaction races | **PARTIAL:** full executable pseudocode and invariant mapping still required |
| 2 | Deterministic, conservative geometry-to-cell coverage | EPSG:4326 to UTM 43N, millimetre quantization, precision 5–10, 10-m inverse-projection densification, 1e-8° pad; new independent 66,848-point sampled coverage check | **PARTIAL:** inverse-projection conservative error bound or verified certified envelope **not proven** |
| 3 | Reproducible code/experiment location | Versioned branch, source ZIP, SHA-256, runnable CI, published artifacts | **SUBSTANTIALLY ADDRESSED:** add immutable release/tag and paper URL |
| 4 | Identical strategy request streams | Frozen request SHA match; 30 equal-start pairs; three native-Fabric pairs | **PARTIAL:** committed state can diverge; counterbalance trace-source and introduce independently generated irregular scenarios |
| 5 | Block-size yield discrepancy / aggregation | Archived raw seed-level data recomputed; separately labeled one-block and six-block protocols | **ADDRESS IN PAPER:** no mixed denominators or pooled data |
| 6 | Documentary unit mislabeled | **22 co-owner interests**, not 22 parcels | **CORRECT IN MANUSCRIPT** |
| 7 | Percentage-point vs relative-percent gain | Use **pp** consistently | **CORRECT IN MANUSCRIPT** |
| 8 | Historical 40 vs 2,560 offered proposals | **40 blocks x 64 = 2,560 proposals per seed**; separately report valid counts | **CORRECT IN MANUSCRIPT** |
| 9 | Bolina numeric disagreement | **3.032612 m² from truncating** 22 fractions to 4 decimals, not proper rounding | **CORRECT IN MANUSCRIPT** |
| 10 | Ambiguous source/terminology/quantities | Define offered, endorsed, ordered, validated, valid; label real documentary and synthetic evidence | **PARTIAL** |
| 11 | Distinct contribution over known methods | Isolate claim-domain, successor resolution, reclaimable compaction; explicitly compare with full-footprint and conservative GKC/SCAN_SAFE | **PARTIAL:** literature-based novelty argument and citations still needed |
| 12 | Actual executable/record-level tests | 44 local + 78 current deployed, legacy 7 separately disclosed; SHA-tracked run artifacts | **SUBSTANTIALLY ADDRESSED:** publish command-level reproducibility instructions |
| 13 | Factorial/controlled comparisons | Equal-start B=64,128,256 simulator; new rate-controlled Fabric workflow | **PARTIAL:** real network factorial repeats/load balancing/independent baselines |
| 14 | Independent safe comparator | `SCAN_SAFE` full-index-independent active-parcel global exact scan, 4/4 tests, equal-start matched-trace run | **PARTIAL:** mathematically conditional on exact area predicates/Fabric validation; inefficient by design |
| 15 | Network topology/delay/resource sensitivity | Three-org single-runner real Fabric, host CPU/memory metrics, 10-TPS fixed-trace 3 pairs; new 10/20/40 workflow | **OPEN:** no true multi-host or WAN-delay test; additional load runs require verified success |
| 16 | Synthetic geometry realism | 576-parcel uniform/heterogeneous synthetic corpus; irregular, thin sliver and diagonal diagnostic polygons | **OPEN:** validated irregular cadastral distribution / third-party field dataset and sensitivity |

## Scientific safety argument — conditional only

Under Fabric's correct MVCC/range-phantom validation, deterministic exact polygon operations in a fixed CRS, immutable versioned parcel IDs, and a **conservative** geohash cover that never misses any newly occupied-area intersection, the conflict-domain argument is plausible: overlapping concurrent claims would share a versioned index dependency or be refused by active exact geometry checks; valid overlaps beyond epsilon should not both commit. The **coverage premise has not been formally proved for inverse-projected UTM edges**, so a claim of unconditional GK-CR safety is **not warranted**.

The derived full-scan comparator bypasses the geohash coverage premise, reads every active parcel and serializes all spatial updates through a shared key. For it, safety still depends on the exact polygon predicate and Fabric validation, but *not* on geohash coverage. This isolates what a conservative reference can guarantee at the cost of heavy contention.

## Resubmission blockers, do not hide

1. Formal conservative-cover proof or certifying fail-closed envelope implementation for the production GK-CR code.
2. Verified additional multi-rate and network-delay/multi-host controls if general throughput claims are retained. Otherwise narrow the claims and report as single-runner pilot data.
3. Independently safe comparator's complete run accounting and performance overhead; properly selected realistic irregular parcel corpus and trace-source counterbalance.
4. Revised IJIES-format manuscript, complete 16-point response with exact source comments/page references, source disclosures, authorship confirmations and author declarations.
5. One-month post-rejection resubmission window and current journal technical requirements confirmed with the editor. No guarantee of acceptance is possible.
