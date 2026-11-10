# IJIES reviewer revision — GeoKhewat v1.5.1
Paper 20267430. This is a research-work branch, NOT an accepted or validated manuscript.

## Source archives required for actual v1.5.1 execution
Upload the following *after removing personal data and obtaining required coauthor permissions* to the research-artifacts/ directory on THIS branch:
1. 06_GeoKhewat_reproducibility_artifact_v10.zip (the archived GeoKhewat_artifact_v10 tree)
2. GeoKhewat_IJIES_Revision_Starter_10Nov2026.zip (the experimental frozen-trace patch and audit tools)

Both archives are already available in the research workspace but have NOT yet been published to this public GitHub branch. Do NOT upload original Jamabandi scans, private credentials or unapproved personal information.

## GitHub Actions procedure
The new workflow is .github/workflows/ijies-reviewer-validation.yml. Push events run evidence preflight only. Once the two archives have been uploaded, open Actions > IJIES v1.5.1 reviewer validation > Run workflow; select this branch and select run_replay=true to run pinned Node tests and the frozen-trace smoke check. Set run_full=true only after the smoke run passes.

## Interpretation
The old main-branch Fabric run used the prior v2 chaincode and does NOT verify 85 tests or the latest 1.5.1 code. The v10 archival per-strategy generator used state-adaptive streams; equal seeds did not guarantee equal proposals. A new frozen-request replay was prepared but has NOT been runtime tested. Later committed states still diverge even when requests are frozen, so a one-block equal-starting-state control is also required. Do not report original 12.0/16.8/20.9 pp results as new fair-replay results. No network/Caliper run is included in this new workflow.

Reviewer backlog: complete pseudocode and successor safety invariant checks; define geohash/CRS/epsilon; publish versioned code/tests/traces; separate offered/endorsed/refused/MVCC/valid; correct 22 co-owner interests, 40 blocks x 64 proposals and Bolina truncation-versus-rounding; rerun safe comparator and network-sensitivity experiments; supply point-by-point response after one-month resubmission wait.
