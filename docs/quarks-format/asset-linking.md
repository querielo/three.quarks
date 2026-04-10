# Asset Linking

Quarks JSON relies on UUID linking from Three.js metadata tables.

## Linked Resources

- `ps.material` -> metadata materials entry
- `ps.instancingGeometry` -> metadata geometries entry
- shape/behavior references may point to object UUIDs (example: `EmitSubParticleSystem` target)

## Loader Resolution

`QuarksLoader` resolves objects and references after parse traversal.

Typical flow:

1. Parse Three.js object graph.
2. Build object UUID map by traversal.
3. Resolve cross-references (sub particle systems and similar links).

## Backward Compatibility

Reader keeps legacy fallbacks for old exports:

- material fallback from `texture` + blending flags
- numeric `startTileIndex`
- numeric `emissionBursts[].count`

Prefer modern fields for new exports.
