# Container and Root Schema

## Container Format

Quarks data lives inside Three.js Object JSON.

### ParticleEmitter

A particle system is stored in:

- `object.type = "ParticleEmitter"`
- `object.ps = { ...ParticleSystem JSON... }`

### QuarksPrefab

`QuarksPrefab` is a timeline object with `animationData` entries.

```json
{
  "type": "QuarksPrefab",
  "animationData": [
    {
      "type": "ps",
      "targetUUID": "emitter-uuid",
      "startTime": 0,
      "duration": 5,
      "loop": true
    },
    {
      "type": "three",
      "targetUUID": "mesh-uuid",
      "clipUUID": "clip-uuid",
      "startTime": 0,
      "duration": 2,
      "loop": false
    }
  ]
}
```

## ParticleSystem (`ps`) Fields

| Field | Type | Notes |
| :--- | :--- | :--- |
| `version` | `string` | Current writer uses `"3.0"`. |
| `autoDestroy` | `boolean` | Destroy after emit end and particle death. |
| `looping` | `boolean` | Restart emission after `duration`. |
| `prewarm` | `boolean` | Pre-simulate one loop when enabled. |
| `duration` | `number` | Emission cycle duration (seconds). |
| `shape` | `ShapeJSON` | Emitter shape config. |
| `startLife` | `FunctionJSON` | Start lifetime generator. |
| `startSpeed` | `FunctionJSON` | Start speed generator. |
| `startRotation` | `FunctionJSON` | Start rotation generator. |
| `startSize` | `FunctionJSON` | Start size generator. |
| `startColor` | `FunctionJSON` | Start color generator. |
| `emissionOverTime` | `FunctionJSON` | Emission rate over time. |
| `emissionOverDistance` | `FunctionJSON` | Emission rate per traveled distance. |
| `emissionBursts` | `Burst[]` | Burst events. |
| `onlyUsedByOther` | `boolean` | Driven by another system (sub-emitter use-case). |
| `instancingGeometry` | `string` | Geometry UUID. |
| `renderMode` | `number` | 0 Billboard, 1 StretchedBillboard, 2 Mesh, 3 Trail, 4 HorizontalBillboard, 5 VerticalBillboard. |
| `rendererEmitterSettings` | `object` | Mode-specific settings. |
| `renderOrder` | `number` | Draw ordering control. |
| `material` | `string` | Material UUID. |
| `layers` | `number` | Three.js layers bitmask. |
| `startTileIndex` | `FunctionJSON` | Initial tile index generator. |
| `uTileCount` | `number` | Horizontal tile count. |
| `vTileCount` | `number` | Vertical tile count. |
| `blendTiles` | `boolean` | Tile blending for frame interpolation. |
| `softParticles` | `boolean` | Depth fade near surfaces. |
| `softNearFade` | `number` | Near fade distance. |
| `softFarFade` | `number` | Far fade distance. |
| `behaviors` | `BehaviorJSON[]` | Behavior list. |
| `worldSpace` | `boolean` | World vs local simulation space. |

## emissionBursts

```json
[
  {
    "time": 0.5,
    "count": { "type": "ConstantValue", "value": 10 },
    "cycle": 1,
    "interval": 0.1,
    "probability": 1
  }
]
```

## rendererEmitterSettings

### Trail (`renderMode: 3`)

```json
{
  "startLength": { "type": "ConstantValue", "value": 30 },
  "followLocalOrigin": false
}
```

### StretchedBillboard (`renderMode: 1`)

```json
{
  "speedFactor": 0,
  "lengthFactor": 2
}
```

### HorizontalBillboard (`renderMode: 4`)

```json
{}
```

### VerticalBillboard (`renderMode: 5`)

```json
{}
```

### Other modes

Usually `{}`.

## Legacy Compatibility Notes

Reader still supports old payloads such as:

- `texture`, `blending`, `transparent` fallback if no `material`
- numeric `startTileIndex`
- numeric `emissionBursts[].count`
- top-level `speedFactor` fallback for stretched billboard

## Current vs Legacy Keys

| Concern | Current Writer | Legacy Reader Support | Recommendation |
| :--- | :--- | :--- | :--- |
| Material reference | `material` (UUID) | `texture` + `blending` + `transparent` fallback | Write `material` |
| Tile index type | `startTileIndex` as `FunctionJSON` | numeric `startTileIndex` | Write `FunctionJSON` |
| Burst count type | `emissionBursts[].count` as `FunctionJSON` | numeric `count` | Write `FunctionJSON` |
| Stretched settings | `rendererEmitterSettings.speedFactor` | top-level `speedFactor` fallback | Write nested value |
| Renderer settings | `rendererEmitterSettings` | missing/empty tolerated | Write explicit mode-specific object |
