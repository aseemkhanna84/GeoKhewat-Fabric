# IJIES Reviewer 1 Comment 2 — Implementation-level geometry audit

**Scope:** Source-derived summary of GeoKhewat chaincode **v1.5.1** in the sanitized research archive. **This document is not a coverage proof.** All claims here are from the source implementation and are not new measurements.

## Configuration and coordinate interpretation

- External coordinates: GeoJSON-like [longitude, latitude] rings, **WGS 84 geographic EPSG:4326**, with a working longitude guard of **66°E through 84°E**.
- Projection: `proj4` version **2.12.1**, transformation `EPSG:4326 -> EPSG:32643` (UTM zone 43N). Chaincode uses a transaction-local origin anchored by `floor(toUTM(first output vertex))`, with geometry rounded to integer millimetres relative to that origin.
- Exact planar arithmetic: `lib/exact.js` uses BigInt/rational arithmetic on *these quantized millimetre coordinates*. It does not make the WGS84→UTM floating-point projection itself exact.
- Geohash: default precision **8** characters; allowed **5–10**. Claim/footprint cell coverage has a **256-cell cap** and an intermediate candidate-grid **65,536-cell cap**; overflow aborts rather than truncates.
- Polygon overlap tolerance: `eps` defaults to **0.01 m²** and is configurable in `[0,1]` m². It is immutable after `InitConfig`. The benchmark/network experiments must explicitly record their effective `GetConfig` response.
- Densification: each straight UTM segment is divided into steps no longer than **10 m** before inverse projection and the geohash cover; cell rectangles receive `1e-8` degrees padding on all boundaries. Touching segments count as meeting a cell in the Liang–Barsky segment/rectangle test.
- Candidate cells in `poly` mode: padded geohash rectangle meets a densified boundary segment, **or** the cell centre lies within the exact claim. The implementation emits sorted unique cell IDs.

## Known scientific caveats

**Conservative coverage has NOT been mathematically established for arbitrary inverse-projected segments.** Ten-metre densification plus a `1e-8°` pad is a computational rule, not by itself a guaranteed error bound under all coordinates/distortions. The reviewer asks for a bound or directly checkable conservative condition; this remains open and must NOT be represented as proved.

Additional tests required:
1. Adaptive subdivision of inverse-projected segments or a certified/checked envelope with a conservative margin.
2. Long diagonal lines crossing geohash boundaries, vertex-on-boundary and sliver-tolerance cases with an independent reference covering method.
3. Repeat with precision 5–10 and near the 256/65,536 candidate caps, verifying refusal rather than silent omission.
4. Equal initial state and cross-endorser deterministic output byte comparisons, including rational intersection numerators/denominators and canonical serialization.
5. Explicit sensitivity tests for the `eps=0.01 m²` threshold.

## Source locations
- `v1.5.1/chaincode/lib/geokhewat-contract.js`: constants, `InitConfig`, `toMM`, `densifiedLL`, `regionCells`, `claimCellsOf`, `CompactCell`.
- `v1.5.1/chaincode/lib/exact.js`: `R()` rational arithmetic, `claimArea2()`, `interArea2()`.
- `v1.5.1/chaincode/package.json`: pinned proj4 and Fabric shim versions.

**Writing guard:** This audit can support the Methods *description* but not the missing formal safety guarantee. It must be included as an unresolved evidence gate in the point-by-point reviewer response until new coverage tests or a valid bound exist.
