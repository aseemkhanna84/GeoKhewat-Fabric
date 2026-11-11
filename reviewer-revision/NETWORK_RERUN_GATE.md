# Three-organisation Fabric/Caliper validation — reproducibility gate

**State (11 November 2026): NOT rerun.**

The archived v1.5.1 source contains native three-organisation deployment scripts but **not** executable, self-contained bootstrap material. These scripts are hardcoded to `/home/claude/gk10` and depend on generated crypto MSP/TLS materials, network channel blocks, Fabric 2.5.16 peer/orderer binaries and chaincode dependency installations. The sanitized source archive excludes generated MSP credentials, channel artifacts and any historical private data for good reasons. Simply copying these scripts into a GitHub Actions runner will not recreate the archived multi-organisation experiment.

Before claiming new Fabric/Caliper evidence:
1. Create a portable, pinned and self-contained three-organisation Fabric 2.5.16 test network, with new ephemeral crypto materials generated at run time. Never commit credentials or TLS keys.
2. Pin chaincode v1.5.1 and calculate checksums before deployment.
3. Run all 85 deployed correctness scenarios, then properly configured 3-repeat Caliper comparisons, saving offered/endorsed/ordered/valid/refused/MVCC counts, throughput, latency distributions, host metrics and versions.
4. Publish a privacy-safe artifact archive and immutable run reference.
5. Compare the network results with the local one-block and six-block data only as separate experiments.

Latest executed local evidence: https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42953843261

Do not write “fresh three-organisation Fabric benchmark passed” in a journal response until that experiment actually executes.
