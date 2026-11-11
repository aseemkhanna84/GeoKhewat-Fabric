# IJIES 20267430: Equal-start and adversarial checks — repeat-CI confirmation

**Executed on GitHub Actions 11 Nov 2026**  
Run: https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43037795097  
Raw artifact (logs, JSONL, 30 paired trace records, generated requests): https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43037795097/artifacts/13863711699  
Workflow: `.github/workflows/ijies-equal-start-safety.yml`  
Source: unchanged v1.5.1 chaincode from published SHA-verified sanitized bundle; use synthetic parcels and reference WGS84/UTM corpus.

## Verified executable checks

- Original pinned chaincode unit tests: **44/44 pass**.
- New adversarial lineage/compaction/boundary-race tests: **3/3 pass**.
- Simulated Fabric validation semantics, one-block paired control: **30/30** (10 seeds × three block sizes), 60 strategy runs.
- Machine verification: paired initial parcel/Khewat geometry SHA-256 matches, paired frozen operation-trace SHA-256 matches; offered = committed + MVCC invalid + phantom invalid + refused; no active-parcel polygon overlaps above epsilon in these test states.

| Offered proposals per single block | GK-F committed/total | GK-CR committed/total | GK-F yield | GK-CR yield | GK-CR advantage |
|---:|---:|---:|---:|---:|---:|
| 64 | 511/640 | 596/640 | 79.84375% | 93.125% | +13.28125 pp |
| 128 | 896/1280 | 1127/1280 | 70.00000% | 88.046875% | +18.046875 pp |
| 256 | 1396/2560 | 1994/2560 | 54.53125% | 77.890625% | +23.359375 pp |

**Exact replication:** The numbers match the earlier verified equal-start run and are not the six-block adaptive benchmark or the real Fabric 3-seed throughput comparison.

## Scientific limits / next evidence gate

This repeat CI run used the same controlled protocol and input-generating code; it is not an independently designed experiment. It is an **in-memory Fabric-semantics simulator**, NOT an additional native three-organisation Fabric deployment. The successful 78/78 current-version network cases and separate three-pair native Fabric mixed workloads are documented in their own evidence reports; they are not pooled with these 60 simulator runs.

Source code describes inverse-projection densification and padded geohash coverage, but it does not provide a mathematical guarantee of conservative coverage for every polygon segment. The proof/counterexample obligation therefore remains open. Also still open: larger independently generated irregular corpus, safe baseline with independently provable conflict protection, multi-host deployment and latency sensitivity, and a precise point-by-point reviewer response. Do not describe the revision as acceptance-ready solely because these CI tests pass.

The publication of a ZIP of sanitized code does not certify that every researcher can deploy it without supplementary configuration and network prerequisites.
