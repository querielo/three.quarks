# Behaviors

Behavior list lives in `ps.behaviors`.

Each behavior object must include `type`.

## Common Behavior Schemas

### ApplyCollision

```json
{
  "type": "ApplyCollision",
  "bounce": 0.5
}
```

### ApplyForce

```json
{
  "type": "ApplyForce",
  "direction": [0, -1, 0],
  "magnitude": { "type": "ConstantValue", "value": 1 }
}
```

### GravityForce

```json
{
  "type": "GravityForce",
  "center": [0, 0, 0],
  "magnitude": 9.8
}
```

### ForceOverLife

```json
{
  "type": "ForceOverLife",
  "x": { "type": "ConstantValue", "value": 0 },
  "y": { "type": "ConstantValue", "value": -9.8 },
  "z": { "type": "ConstantValue", "value": 0 }
}
```

### ColorOverLife

```json
{
  "type": "ColorOverLife",
  "color": { "type": "Gradient" }
}
```

### ColorBySpeed

```json
{
  "type": "ColorBySpeed",
  "color": { "type": "Gradient" },
  "speedRange": { "type": "IntervalValue", "a": 0, "b": 10 }
}
```

### SizeOverLife

```json
{
  "type": "SizeOverLife",
  "size": { "type": "PiecewiseBezier" }
}
```

### SizeBySpeed

```json
{
  "type": "SizeBySpeed",
  "size": { "type": "ConstantValue", "value": 1 },
  "speedRange": { "type": "IntervalValue", "a": 0, "b": 10 }
}
```

### RotationOverLife

```json
{
  "type": "RotationOverLife",
  "angularVelocity": { "type": "ConstantValue", "value": 1 }
}
```

### Rotation3DOverLife

```json
{
  "type": "Rotation3DOverLife",
  "angularVelocity": {
    "type": "Euler",
    "angleX": { "type": "ConstantValue", "value": 1 },
    "angleY": { "type": "ConstantValue", "value": 0 },
    "angleZ": { "type": "ConstantValue", "value": 0 }
  }
}
```

### RotationBySpeed

```json
{
  "type": "RotationBySpeed",
  "angularVelocity": { "type": "ConstantValue", "value": 1 },
  "speedRange": { "type": "IntervalValue", "a": 0, "b": 10 }
}
```

### SpeedOverLife

```json
{
  "type": "SpeedOverLife",
  "speed": { "type": "PiecewiseBezier" }
}
```

### LimitSpeedOverLife

```json
{
  "type": "LimitSpeedOverLife",
  "speed": { "type": "ConstantValue", "value": 2 },
  "dampen": 0.1
}
```

### FrameOverLife

```json
{
  "type": "FrameOverLife",
  "frame": { "type": "IntervalValue", "a": 0, "b": 15 }
}
```

### WidthOverLength

```json
{
  "type": "WidthOverLength",
  "width": { "type": "PiecewiseBezier" }
}
```

### ChangeEmitDirection

```json
{
  "type": "ChangeEmitDirection",
  "angle": { "type": "ConstantValue", "value": 0.1 }
}
```

### OrbitOverLife

```json
{
  "type": "OrbitOverLife",
  "orbitSpeed": { "type": "ConstantValue", "value": 2 },
  "axis": [0, 1, 0]
}
```

### Noise

```json
{
  "type": "Noise",
  "frequency": { "type": "ConstantValue", "value": 1 },
  "power": { "type": "ConstantValue", "value": 0.1 },
  "positionAmount": { "type": "ConstantValue", "value": 1 },
  "rotationAmount": { "type": "ConstantValue", "value": 0 }
}
```

### TurbulenceField

```json
{
  "type": "TurbulenceField",
  "scale": [1, 1, 1],
  "octaves": 1,
  "velocityMultiplier": [1, 1, 1],
  "timeScale": [1, 1, 1]
}
```

### ApplySequences

```json
{
  "type": "ApplySequences",
  "delay": 0.1,
  "sequencers": [
    {
      "range": { "type": "IntervalValue", "a": 0, "b": 1 },
      "sequencer": {
        "type": "TextureSequencer",
        "scaleX": 1,
        "scaleY": 1,
        "position": [0, 0, 0],
        "locations": [{ "x": 0, "y": 0 }]
      }
    }
  ]
}
```

### EmitSubParticleSystem

```json
{
  "type": "EmitSubParticleSystem",
  "subParticleSystem": "uuid-of-other-system",
  "mode": 0,
  "emitProbability": 1,
  "useVelocityAsBasis": false
}
```

## Registration Note

Serialization may still produce some behavior types that are not currently enabled in the behavior registry for JSON loading in every runtime configuration. Verify `BehaviorTypes` map when consuming external JSON.

## Registry Status Snapshot

The following status reflects current behavior registry wiring in `quarks.core`:

| Behavior | Can Serialize (`toJSON`) | Registered in `BehaviorTypes` loader map |
| :--- | :--- | :--- |
| `ApplyCollision` | Yes | No (currently not enabled) |
| `ApplySequences` | Yes | No (currently not enabled) |
| Most others listed above | Yes | Yes |

Practical implication:

- JSON may contain `ApplyCollision` or `ApplySequences`, but default `BehaviorFromJSON` may not reconstruct them unless registry wiring is enabled in your runtime.
