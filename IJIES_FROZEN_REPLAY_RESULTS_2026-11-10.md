# IJIES 20267430: Frozen-request replay — experimental results (10 November 2026)

**GitHub Actions run:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42886219609  
**Complete diagnostic artifact:** https://github.com/aseemkhanna84/GeoKhewat-Fabric/actions/runs/42886219609/artifacts/13797275402

Source: GeoKhewat v1.5.1 sanitized source archive (SHA256: c0f45b10234f3fc908ed2e96ff9be2e9d70b91eb4590882c6dd8e0751dadef37). All 44 pinned chaincode unit tests passed. **This was a local Fabric-semantics simulator, not a new deployed three-organisation Fabric/Caliper experiment.**

| Block size | Strategy | Offered | Endorsed | Refused | MVCC invalid | Committed | Yield |
|---:|---|---:|---:|---:|---:|---:|---:|
| 64 | GK-F | 3840 | 3682 | 158 | 669 | 3013 | 78.464% |
| 64 | GK-CR | 3840 | 3756 | 84 | 233 | 3523 | 91.745% |
| 128 | GK-F | 7680 | 7068 | 612 | 1951 | 5117 | 66.628% |
| 128 | GK-CR | 7680 | 7414 | 266 | 827 | 6587 | 85.768% |
| 256 | GK-F | 15360 | 13110 | 2250 | 4924 | 8186 | 53.294% |
| 256 | GK-CR | 15360 | 14553 | 807 | 2705 | 11848 | 77.135% |

Paired GK-CR minus GK-F mean commit-yield differences: **13.28125, 19.140625, 23.84114583 percentage points** for B=64, 128, 256 respectively. Each used 10 independent seeds and six blocks per seed. Results differ from the earlier 12.0/16.8/20.9 pp figures in the IJIES manuscript because the request-generation protocol was changed.

**Verification:** 60 JSONL experiment outputs; for all 30 (block size, seed) combinations, the two strategies used identical SHA-256 request-trace hashes. Accounting satisfies offered = refused + MVCC invalid + phantom invalid + committed; all 60 cases record zero post-commit polygon overlaps exceeding the configured epsilon.

**Limitations requiring explicit reviewer disclosure:** Each frozen trace was generated from a reference GK-CR trajectory, and GKF/GKCR state histories diverge after different commits. Shared request IDs alone cannot eliminate all state-dependent differences. Run **equal-initial-state, one-block trials**, alternate reference-trace sampling and adversarial successor/compaction schedules before representing this as a decisive causal gain or safety guarantee. No current network-level throughput or Caliper measurements were run here. Original archival scores and previous multi-organisation Fabric outcomes are separate datasets.

This report is evidence of an executed exploratory comparison, **not** proof that all 16 IJIES reviewer comments are resolved, and not a final submission-ready scientific package.
