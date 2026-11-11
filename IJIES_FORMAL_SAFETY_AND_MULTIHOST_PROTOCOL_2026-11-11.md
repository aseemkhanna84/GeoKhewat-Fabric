# GeoKhewat IJIES 20267430: safety proof obligations and multi-host replication protocol

**Status:** Formal proof plan and reproducibility plan. **NO mathematical coverage proof or multi-host data is asserted by this file.** This is for Reviewer Comments 1, 2, 13–16 and manuscript limitations.

## A. Precise properties to establish

Let `L_t` denote the active parcel rings after Fabric block `t`. For an output ring `N` and retired input rings `O_1,...,O_k` (here `k<=2`), let the newly claimed area be `A=N \ (O_1 union ... union O_k)`. For configured permitted overlap `eps=0.01 m²`, the target safety property is:

`forall P,Q in L_t, P!=Q: exact_area(P intersection Q) <= eps`.

Any proof or claim must state its dependence on the **projected, millimetre-quantized polygon model**, not on mathematically exact WGS84 Earth surface geometry.

### P1 — Conservative claimed-area coverage (currently OPEN)

Every precision-`p` geohash cell whose interior meets `A` in positive area must be present in the claim's produced cell list, or the algorithm must **refuse** the operation. Inverse-projected straight UTM edges curve in geodetic coordinates. The source's ten-metre densification and `1e-8°` padding are finite heuristics and have **no certified universal error bound** at present.

A new empirical diagnostic in `reviewer-revision/independent_coverage_diagnostic.js` compares original cover outputs with independently computed geohashes from 0.2-metre boundary samples. This falsifies obvious omissions in its sampled cases but **cannot prove P1**. A rigorous solution needs outward-rounded interval projection or verified adaptive subdivision with a certified curvature/error bound; where the bound is not established, a conservative mode should refuse or use the exact global scan fallback.

### P2 — Complete historic claim index (currently PARTIAL)

For each committed spatial output and each newly claimed cell, a claim record must be written with a persistent geometry version; a future intersecting claim must either find this record or be refused. Test initial index creation, concurrent new-key read/version collision, covered cells, and old-record retention.

### P3 — Successor frontier resolution (PARTIAL)

For each retired parcel version referenced by a historical claim cell, the `_frontier` traversal must discover **all** live descendants relevant to the cell without cycles, skipped branches or undetected depth overflow. Partition → amalgamation → partition scenarios have executable adversarial tests; arbitrary DAG schedules still require invariant-based property testing.

### P4 — Reclaimable compaction/refresh preserves safety (PARTIAL)

`CompactCell` may change the shape of claim entries and reduce stale index references; it must not delete the only witness for a currently live region or authorize an overlapping claimant. Validation must include both commit orders when a compaction races with a boundary edit.

### P5 — Exact predicates and deterministic endorsement (PARTIAL)

The integer-millimetre rational area computation in `lib/exact.js` is exact *on the discretized input*, whereas EPSG:4326-to-UTM projection uses floating-point software. Require fixed library versions, canonical ring ordering, precision-specific tests at tolerance boundaries, and **byte-for-byte multi-endorser results** for identical transaction input. No general statement of equal floating-point behavior across all platforms can be inferred from one runner.

### P6 — Fabric MVCC and phantom validation (TESTED IN PART)

Concurrent endorsed spatial transactions must conflict on the same indexed dependency or, under the separately derived `SCAN_SAFE` reference variant, on the globally written registry epoch. When scanning all active parcels via `GetStateByRange`, Fabric's range-query phantom check and exact overlap predicate provide an index-independent reference, at the expected loss of concurrency. This is a **different algorithm** from native GKCR and must remain labeled as such.

**Logical consequence is conditional:** P1–P6, if rigorously established and maintained, are sufficient ingredients for a safe inductive argument. The current evidence does **not** establish their universal truth, particularly P1. Do not write “safety proved” in the paper.

## B. Multi-host experiment specification — NOT RUN

### Environment gate

Use separate, authorized virtual machines or physical hosts for:
- one SurveyMSP peer + its CouchDB/LevelDB (record selected storage consistently),
- one RevenueMSP peer,
- one RegistrationMSP peer,
- at least one independently hosted Raft orderer.

Use pinned Fabric **2.5.16**, 2-of-3 endorsement, TLS, fixed chaincode SHA-256, fresh ephemeral MSPs/CA materials generated in the lab, independent time synchronization (NTP), and logged CPU/RAM/network interface specifications.

**Important:** A three-org Fabric network with all peers and orderer on one GitHub runner is **not a multi-host experiment**, even though there are three MSPs.

### Design and variables

- Strategy arms: original GK-F, original GK-CR, plus the derived `SCAN_SAFE` reference only if its additional overhead and provenance are made explicit.
- Offered rates: **10, 20, 40 transactions/s**, open-loop; fixed-request traces matched by SHA-256 within each experimental pair.
- Workload: a declared shared synthetic initial map, a fixed mixture of registrations, boundary rectifications, partitions and amalgamations with the same operations and order; distinguish deterministic request invalidity from MVCC invalidity.
- Repetitions: at least **five independent seeds**, balanced order of arm execution, 5-s warm-up excluded and ≥30-s measured window. Precommit state must be independently reconstructed or reset per arm/condition; a reused mutated ledger is not a fair equal-start test.
- Network sensitivity: controlled laboratory delay groups (e.g. **0, 20, 50 ms** one-way, with clearly measured actual RTT and jitter). Apply emulator rules only to authorized lab interfaces, record exact `tc netem` configuration and restore network after runs.
- Geometry sensitivity: use irregular synthetic shared-vertex polygons from `irregular_synthetic_cadastre.js`, and disclose that no field-derived frequency distribution was calibrated.
- Optional storage policy sensitivity: LevelDB vs CouchDB with otherwise fixed configuration and independent run labels.

### Required per-transaction and run-level output

`experiment_id, seed, strategy, rate_target_tps, net_delay_ms, source_sha256, initial_state_sha256, proposal_trace_sha256, offered, endorsed, submitted, ordered, valid, refused, MVCC_invalid, phantom_invalid, other_invalid, run_wall_seconds, committed_tps, endorsement_p50_ms, endorsement_p95_ms, valid_latency_p50_ms, valid_latency_p95_ms, valid_latency_p99_ms, invalid_latency_p95_ms, peer_CPU_percent, orderer_CPU_percent, peer_RSS_MB, network_bytes, Fabric_version, config_hash`.

Keep raw transaction status CSVs, event timestamps, syslogs, chaincode logs, Caliper reports if Caliper is actually used, and explicit inclusion/exclusion of warm-up and setup. Record validation-block numbers for all observed commits. Report paired confidence intervals as exploratory if the sample remains small; never pool across materially different protocols.

### Reproducibility acceptance gate

A multi-host result may be included in the Results section only after:
1. machine metadata, network configuration, source and trace hashes are captured;
2. counts satisfy offered = refused + ordered-status outcomes + explicitly categorized transport/setup losses;
3. the same initial map/requests are verified within each paired comparison;
4. actual output files and a successful run URL exist and are inspectable;
5. network-delay condition is measured rather than inferred from settings;
6. all paper figures and p95 claims are regenerated from archived CSVs.

Until these conditions hold, write **“multi-host and WAN-delay sensitivity remain future validation”** and restrict claims to single-runner three-organisation tests.
