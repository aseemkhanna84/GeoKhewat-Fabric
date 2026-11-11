# Verified three-organisation Fabric v1.5.1 regression evidence — 11 Nov 2026

- **Study:** GeoKhewat, IJIES paper 20267430
- **Runtime:** Hyperledger Fabric 2.5.16 native binaries, one Raft orderer, three peers (SurveyMSP, RevenueMSP, RegistrationMSP), TLS, LevelDB, majority endorsement.
- **Chaincode:** GeoKhewat v1.5.1 as a service, deployed in seven configurations on the same freshly generated network.
- **Live CI execution:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42956917137
- **New network test summary (from stdout and JSON):** **78 tests, 78 passed, 0 failed.** Includes functionality, roles, SBE, MVCC concurrency, exact overlap and released-land checks.
- **Interleaving parameter:** GK_PAIRS=3 for this CI run; the historical archive used GK_PAIRS=20. Do not confuse the two experiments.
- **Seven v1.3 historical defect-replay cases:** excluded because executable v1.3 source is not in the publicly released sanitized bundle. Historical 85/85 archived outcome is not the same as new 78/78.
- **Job outcome:** overall workflow marked **failure** due to Caliper `npm ci` missing a lockfile in the sanitized archive, AFTER the 78 network tests passed. This does **not** invalidate the observed 78/78 result but Caliper throughput/latency were **not** measured in this run.
- **Separate full successful v1.5.1 deployed smoke run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42956239450 (synthetic parcel registered then independently queried from all three peers).
- **Reproducibility boundary:** single GitHub-hosted runner; synthetic geometry; not multi-host deployment, not independent survey/cadastral validation.

Next gates: a successful separate Caliper smoke with saved runtime-resolved lockfile, then three-repeat deployed benchmark with duration/warmup/resource info, stronger independent comparator and final point-by-point reviewer response. Do not claim the final paper is submission-ready yet.
