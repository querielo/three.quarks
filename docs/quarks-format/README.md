# Quarks JSON Format

This documentation describes the JSON serialization format used by `three.quarks`.

## Structure

The format is embedded in Three.js Object JSON. Quarks-specific nodes are:

- `ParticleEmitter` (contains one particle system in `ps`)
- `QuarksPrefab` (timeline controller for particle/three animations)

## Docs Map

- [Container and Root Schema](./container-and-root-schema.md)
- [Value Generators](./value-generators.md)
- [Emitter Shapes](./emitter-shapes.md)
- [Behaviors](./behaviors.md)
- [Asset Linking](./asset-linking.md)

## Real Examples In Repo

- Full fixture with mesh surface + legacy fields: `packages/three.quarks/test/JsonFiles.ts`
- Loader behavior tests: `packages/three.quarks/test/QuarksLoader.test.ts`

## Format Versioning Policy

- `ps.version` identifies writer format generation.
- Keep reader backward-compatible for at least one major library cycle when introducing schema changes.
- Prefer additive changes over breaking renames.
- If a rename is required, support both keys in reader and mark old key deprecated in docs.
- Update docs and tests in the same change when schema changes.

## Quick Example

```json
{
  "metadata": { "version": 4.5, "type": "Object", "generator": "Object3D.toJSON" },
  "object": {
    "type": "ParticleEmitter",
    "ps": {
      "version": "3.0",
      "autoDestroy": false,
      "looping": true,
      "duration": 1,
      "shape": { "type": "sphere", "radius": 1 },
      "startLife": { "type": "ConstantValue", "value": 5 },
      "startSpeed": { "type": "ConstantValue", "value": 1 },
      "startRotation": { "type": "ConstantValue", "value": 0 },
      "startSize": { "type": "ConstantValue", "value": 1 },
      "startColor": {
        "type": "ConstantColor",
        "color": { "r": 1, "g": 1, "b": 1, "a": 1 }
      },
      "emissionOverTime": { "type": "ConstantValue", "value": 10 },
      "emissionOverDistance": { "type": "ConstantValue", "value": 0 },
      "emissionBursts": [],
      "onlyUsedByOther": false,
      "instancingGeometry": "geometry-uuid",
      "renderMode": 0,
      "rendererEmitterSettings": {},
      "material": "material-uuid",
      "startTileIndex": { "type": "ConstantValue", "value": 0 },
      "uTileCount": 1,
      "vTileCount": 1,
      "blendTiles": false,
      "softParticles": false,
      "softNearFade": 0,
      "softFarFade": 0,
      "behaviors": [],
      "worldSpace": false
    }
  }
}
```
