# Draft — IJIES response to Reviewer 1 Comment 4 and Reviewer 2 Comment 15

**Paper:** GeoKhewat, IJIES 20267430  
**Draft status:** Requires manuscript page references, coauthor approval and additional sensitivity experiments. Do not send without completing the full 16-point response.

## Reviewer 1, Comment 4 — identical request streams

**Response (draft).** We agree that the previously described workload did not ensure identical proposals after the strategies diverged. The earlier method generated proposals from each strategy's committed state; using the same random seed alone was insufficient. We have therefore implemented a separate, explicitly labeled frozen-request protocol. For each of three independent seeds (17, 23 and 29), an immutable stream of 120 synthetic boundary-rectification/partition proposals was generated before executing either strategy. On native Hyperledger Fabric 2.5.16, GK-F and GK-CR were initialized with the same 64 synthetic parcels. Within each seed pair, the frozen request SHA-256 and observed initial parcel geometry SHA-256 were identical.

After excluding a 2-second warm-up, each strategy had exactly 100 measured offered proposals per seed. In all six runs, every measured proposal was submitted, assigned a block and returned a validation status. The paired committed counts were 54 versus 86, 55 versus 79, and 57 versus 84 (GK-F versus GK-CR). The paired differences were +32, +24 and +27 percentage points (mean +27.67 pp). The full request traces, per-transaction validation codes, execution script and GitHub job logs are in the linked artifact.

We now explicitly distinguish the archived adaptive-stream experiment, this frozen real-Fabric experiment, and the single-block equal-starting-state local simulator experiment. Importantly, even with identical *offered requests*, each strategy can commit a different subset and subsequent ledger states may diverge. Accordingly, the observed yield gain is reported as an experimental result under this protocol, **not** as proof that every invalidation was a false cell conflict. Endorsement refusal, MVCC invalidation, observed ordering and successful commits are reported separately.

**Supporting artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42984858025/artifacts/13839367098  
**Workflow:** `.github/workflows/ijies-fabric-frozen-3repeat.yml`

## Reviewer 2, Comment 15 — real Fabric variability and resource constraints

**Response (draft).** We have supplemented the original network smoke checks with three paired fixed-request experiments executed on a real native three-organisation Fabric 2.5.16 network (SurveyMSP, RevenueMSP, RegistrationMSP) hosted on a single GitHub Actions runner. Each seed pair used the same initial parcel geometry, identical 120-request trace, 10 offered proposals per second and 12-second workload duration with the initial 2 seconds excluded. Three seed pairs generated 300 measured offered transactions per strategy.

Over the three runs, GK-F committed 166/300 transactions with 134 MVCC invalidations; GK-CR committed 249/300 with 51 MVCC invalidations. All 600 measured proposals had observed ordering/validation status and no recorded endorsement refusals. The average committed throughput was 5.56 and 8.35 TPS, respectively. The means of run-level p95 latencies for *valid transactions* were 949.9 ms and 939.0 ms; the separate nonvalid latency distributions and per-transaction timestamps are available in the linked JSON/CSV files. The paired mean commit-yield difference was +27.67 percentage points, with an exploratory n=3 t-based 95% interval of 17.63–37.71 pp.

We have added the runner CPU and memory metadata, exact transaction accounting, source hashes and reproducibility scripts. **This does not yet establish multi-host validity, network-delay sensitivity or statistically stable p95 ranking.** These remain study limitations and are not claimed as completed experiments. The short-run, single-host nature of the additional data is stated clearly.

**Required before final submission:** Insert the actual revised manuscript section/table numbers; report cumulative host CPU/RSS deltas where valid; add network-delay/resource sensitivity if claiming broad deployed performance generality; add controlled safe comparator; ensure corresponding author/coauthor approvals.

This document is a scientifically cautious draft, not a claim of complete IJIES revision readiness.
