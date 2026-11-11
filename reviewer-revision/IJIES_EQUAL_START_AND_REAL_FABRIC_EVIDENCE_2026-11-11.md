# GeoKhewat IJIES 20267430 — equal-start, adversarial and real-Fabric evidence
**Audit date:** 11 November 2026  
**Research status:** technical validation in progress, **not** a journal-ready safety proof.

## A. Equal-initial-state, one-block paired benchmark

**Run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43011632108  
**Raw evidence artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/43011632108/artifacts/13850922446

The code derives an SHA-256 digest of the canonicalized initial PARCEL and KHEWAT state, excluding index representations (which are inherently different across GK-F and GK-CR). For each of 30 pairs (10 seeds × 3 block sizes), the initial-state digest and frozen proposal-trace digest match. Both strategies execute one block from the same geometry and ownership fixture; commit outcomes are recorded separately.

| Offers per block | Repeats | Total offered per strategy | GK-F valid | GK-CR valid | GK-F yield | GK-CR yield | GK-CR minus GK-F |
|---:|---:|---:|---:|---:|---:|---:|---:|
| 64 | 10 | 640 | 511 | 596 | 79.8438% | 93.1250% | +13.2813 percentage points |
| 128 | 10 | 1,280 | 896 | 1,127 | 70.0000% | 88.0469% | +18.0469 pp |
| 256 | 10 | 2,560 | 1,396 | 1,994 | 54.5313% | 77.8906% | +23.3594 pp |

**Limitations:** The frozen requests originate from a GK-CR reference sequence, creating possible request-distribution bias. Different strategies' index data structures are not equal by design; “same initial state” means same cadastral and ownership records, not byte-identical ledger state. This is a local Fabric-semantics stub, **not** peer/orderer network execution. Commit-yield gain is specific to this controlled synthetic workload; it is not a claimed general effect size or statistical proof.

## B. Additional adversarial tests

The same run executed **44/44 original chaincode tests** and **3/3 new adversarial tests**, all passed:
- Multiple successive retirements (P -> A/B -> M -> M1/M2), an overlapping registration blocked both before and after CompactCell.
- Two competing boundary claims into the same gap after lineage changes; both validation orders checked, at most one valid commit, active overlaps remained within epsilon.
- Concurrent CompactCell and boundary-claim validation in both orders; no ghost parcel admitted by the subsequent probe.

All tests use synthetic geometries and the local stub. This adds coverage but **does not prove every possible schedule or polygon geometry safe**.

## C. Separate real Fabric 2.5.16 evidence (three organisations)

**Run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025  
**Raw evidence artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025/artifacts/13839367098

Real Hyperledger Fabric 2.5.16, **three organisations on one GitHub runner**, deployed v1.5.1 GK-F and GK-CR chaincodes. Three independent frozen synthetic traces were replayed across both strategies in opposite run orders. The workflow verified each seed pair's identical request trace and canonical initial *observed* ledger records; the source snapshot is hash-tracked. Commit validity came from observed transaction status codes.

| Seed | Offered per strategy | GK-F committed | GK-CR committed | Paired difference |
|---:|---:|---:|---:|---:|
| 17 | 100 | 54 | 86 | +32 pp |
| 23 | 100 | 55 | 79 | +24 pp |
| 29 | 100 | 57 | 84 | +27 pp |
| **All 3** | **300** | **166 (55.33%)** | **249 (83.00%)** | **+27.67 pp** |

All 600 offered transactions across both strategies were submitted and had ordered status observed. There were no reported endorsement refusals in these six runs. The GKF and GKCR observed p95 successful latency is about 0.93–0.95 seconds in these tests, but this small sample is **not** a network-scale latency benchmark. The generator's trace-preparation count was 120 events while each measured trial offers 100 submissions; these two numbers must not be interchanged in the paper.

**Limitations:** 3 seeds are insufficient for strong generalized performance inference. One self-hosted simulated study and one single-runner three-organisation campaign are distinct datasets, not direct cross-layer replications. Network sensitivity, multiple endorsers, CPU/network controls, Caliper factorial runs, permutation of trace-source strategy and stronger safety validation remain outstanding.

## D. Manuscript changes before resubmission
1. Separate archival state-adaptive benchmarks, six-block frozen replay, one-block equal-start replay and actual Fabric runs in **different tables**.
2. Avoid presenting any simulated number as a network TPS/latency value or claiming proof solely from 47 passing tests.
3. Treat offered, submitted, ordered, committed, MVCC invalidated, phantom invalidated and endorsement refusals as separate outcome columns.
4. Explain GKCR-sourced trace bias and repeat using independent strategy-neutral synthetic traces or counterbalanced trace sources.
5. Document epsilon/CRS, geometric precision, initial index, lineage retirement, CompactCell, and concurrent schedules in reproducible algorithm steps.
6. Correct documentary evidence to “22 co-owner interests”, distinguish truncation from rounding, and fix historical “40 blocks × 64 proposals” denominator.
7. Make immutable source and output artifacts accessible via pinned commit/release, then deliver the complete 16-point IJIES reviewer response.
