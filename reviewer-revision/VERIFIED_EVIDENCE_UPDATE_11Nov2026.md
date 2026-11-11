# GeoKhewat IJIES 20267430 — Independently Checkable Technical Evidence
**Evidence update:** 11 November 2026  
**Source code:** GeoKhewat v1.5.1, sanitized source SHA-256 `c0f45b10234f3fc908ed2e96ff9be2e9d70b91eb4590882c6dd8e0751dadef37`  
**Main branch unchanged.** This work branch has not yet resolved every reviewer comment; these results are not an IJIES acceptance guarantee.

## A. Equal-initial-geometry, one-block simulation

GitHub Actions [run 43002321937](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43002321937), [diagnostic ZIP artifact](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43002321937/artifacts/13846811671).

- Original pinned local chaincode suite passed; three new adversarial successor and compaction tests passed.
- Ten paired seeds (1–10) for each block size. **20 strategy executions per block size**, 60 in total.
- Before each pair, SHA-256 of canonical parcel geometry, active/retired status, lineage and share state matched.
- Strategies received exactly the same pre-generated one-block request trace (SHA-256 comparison); all transactions counted exactly once.
- The following are **local Fabric-semantics simulation outcomes**, not native Fabric throughput.

| Proposals per block | GK-F valid / offered | GK-CR valid / offered | GK-F yield | GK-CR yield | Paired advantage (pp) | Approx. paired 95% t interval (pp) |
|---:|---:|---:|---:|---:|---:|---:|
| 64 | 511/640 | 596/640 | 79.84375% | 93.12500% | 13.28125 | [10.11,16.45] |
| 128 | 896/1280 | 1127/1280 | 70.00000% | 88.046875% | 18.046875 | [16.37,19.72] |
| 256 | 1396/2560 | 1994/2560 | 54.53125% | 77.890625% | 23.359375 | [22.27,24.44] |

The intervals summarize seed-to-seed variability conditional on this synthetic setup; they do not encompass deployment uncertainty or all plausible cadastres. In this isolated single-block design the recorded failures were MVCC conflicts, with zero endorsement refusals in these conditions; safety beyond tested cases is not proven.

## B. Native Hyperledger Fabric 2.5.16, three organisations, three matched seeds

GitHub Actions [run 42984858025](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025), [raw transaction and latency evidence](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025/artifacts/13839367098).

The GitHub job bootstrapped three-org Fabric, deployed both v1.5.1 variants, verified matching initial ledger geometries and exact matched synthetic request hashes by paired seed, and checked that the sum of transaction status codes equals offered transactions.

| Seed | Offered per strategy | GK-F committed | GK-CR committed | Advantage (percentage points) | GK-F MVCC invalid | GK-CR MVCC invalid |
|---:|---:|---:|---:|---:|---:|---:|
| 17 | 100 | 54 | 86 | 32 | 46 | 14 |
| 23 | 100 | 55 | 79 | 24 | 45 | 21 |
| 29 | 100 | 57 | 84 | 27 | 43 | 16 |
| **Total** | **300** | **166** | **249** | **27.67 pp** | **134** | **51** |

Committed fraction (offered denominator): GK-F **55.33%** and GK-CR **83.00%**. Each paired seed used an identical frozen trace and an independently checked identical initial geometry hash. The sample size is **only three seeds**, no WAN-delay variation and no external multi-host field deployment. Thus this is an **executed small-scale network pilot** rather than a broad performance generalization or proof of concurrency correctness.

Valid transaction p95 end-to-end latencies by seed, GK-F versus GK-CR: 950.69/932.44 ms (17), 948.99/943.30 ms (23), and 949.92/941.34 ms (29). They are not the consensus-only latency.

## C. Other verified real-network checks

[Fabric registration and mixed-load pilot run 42969537345](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42969537345) completed one repetition at offered rates of 10, 20, and 40 TPS on synthetic registration data, plus a single contended mixed edit pilot per strategy. **Do not equate offered TPS with committed throughput.** It supports engineering feasibility on a single GitHub runner, not a full network-scaling study.

## Reviewer gates still outstanding

1. Run independent geometric adversarial sequences and property-based fuzzing over more irregular polygon inputs, including the multi-generation lineage safety invariant.
2. Document exact executable pseudocode, index key read/write families, boundary quantization, coordinate reference system, geometry comparison tolerance, and compaction correctness assumptions.
3. Revisit trace-generator selection bias (frozen requests derived from a GK-CR reference trajectory); repeat with other trace sources and realistic irregular cadastre distributions.
4. Expand native Fabric paired tests beyond three seeds and report run-order effects, confidence intervals, TLS/CPU/memory usage, resources, endorsement-policy differences, and variable network delay with actual logs.
5. Compare to a **safe** alternative and controlled baselines, with full accounting for submitted, endorsed, ordered, committed, refused and MVCC invalid transactions; separate local simulation from the network results.
6. Correct manuscript documentary points: **22 co-owner interests**, not 22 parcels; 40 blocks × 64 offers = **2,560 proposals per seed**; **3.0326 m² is truncation, not rounding** discrepancy.
7. Provide editor-facing supplemental artifact link, complete change log and replies to all 16 comments. Confirm resubmission timing with IJIES. Avoid disclosing personal land-record data.

**No newly executed full Fabric/Caliper scaling campaign or formal safety proof is claimed here.**