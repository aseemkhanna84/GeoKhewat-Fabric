# IJIES Reviewer 1 / 2 — Controlled one-block and adversarial evidence
**Paper:** 20267430  
**Date:** 11 November 2026  
**Verified CI run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42953843261  
**Original JSONL, traces, test stdout:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42953843261/artifacts/13826262179

### Method
The reviewer branch ran pinned GeoKhewat v1.5.1 unit tests (44 passed), three *new* adversarial tests (3 passed), and a single-block comparison using the same canonical starting parcel/Khewat state and exact frozen request trace per seed. Thirty matched seed/block-size pairs = 60 strategy runs. The starting state includes 576 synthetic parcels; both strategies' `initial_geometry_sha256` values matched in all pairs.

| Proposals per block | GK-F validated / offered | GK-CR validated / offered | GK-F yield | GK-CR yield | Difference (pp) |
| ---: | ---: | ---: | ---: | ---: | ---: |
| 64 | 511 / 640 | 596 / 640 | 79.84375% | 93.125% | +13.28125 |
| 128 | 896 / 1,280 | 1,127 / 1,280 | 70.00000% | 88.046875% | +18.046875 |
| 256 | 1,396 / 2,560 | 1,994 / 2,560 | 54.53125% | 77.890625% | +23.359375 |

Every run satisfies offered = committed + MVCC invalidated + phantom invalidated + refused; post-commit polygon overlap was zero in the tested configurations. The three targeted tests cover multi-generation partition→amalgamation→partition lineage, new-registration/compaction, competing overlapping edits in both commit orders, and compaction races.

### Limits — do not overstate the evidence
This executes an *in-memory Fabric-semantics simulator*, not the real three-organisation Fabric/Caliper network. One block removes the major later-state divergence in the six-block study, but does not prove complete concurrency safety. Index storage differs by strategy as intended. These figures MUST NOT be substituted for archived 12.0/16.8/20.9 pp claims without labeling the new one-block protocol and recalculating the relevant statistical interval.

The initial test run [42953654964](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42953654964) had a fixture that violated the chaincode's 2% rectification-area rule; the corrected fixture passed in [42953843261](https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42953843261). This was a test-design defect, not proof of a chaincode defect.

### Reviewer action gates still open
Exact safety pseudocode and coverage conventions; compaction/candidate invariant proof; repeated controlled variants and ablations; reproducible irregular parcel corpora; the real three-organisation Fabric/Caliper rerun including raw offered/endorsed/ordered/valid counts and latency distributions. The resubmission must include a point-by-point response and wait the journal's one-month post-rejection interval.
