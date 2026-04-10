# Value Generators

`FunctionJSON` is a tagged object (`type`) used by start fields, emission fields, shape speed, and many behavior params.

## Scalar Generators

### ConstantValue

```json
{ "type": "ConstantValue", "value": 10 }
```

### IntervalValue

```json
{ "type": "IntervalValue", "a": 5, "b": 10 }
```

### PiecewiseBezier

```json
{
  "type": "PiecewiseBezier",
  "functions": [
    {
      "function": { "p0": 0, "p1": 0.33, "p2": 0.66, "p3": 1 },
      "start": 0
    }
  ]
}
```

## Color Generators

### ConstantColor

```json
{
  "type": "ConstantColor",
  "color": { "r": 1, "g": 1, "b": 1, "a": 1 }
}
```

### ColorRange

```json
{
  "type": "ColorRange",
  "a": { "r": 1, "g": 0, "b": 0, "a": 1 },
  "b": { "r": 0, "g": 0, "b": 1, "a": 1 }
}
```

### RandomColor

```json
{
  "type": "RandomColor",
  "a": { "r": 1, "g": 1, "b": 1, "a": 1 },
  "b": { "r": 0, "g": 0, "b": 0, "a": 1 }
}
```

### Gradient

```json
{
  "type": "Gradient",
  "color": {
    "type": "CLinearFunction",
    "subType": "Color",
    "keys": [
      { "value": { "r": 1, "g": 0, "b": 0 }, "pos": 0 },
      { "value": { "r": 0, "g": 0, "b": 1 }, "pos": 1 }
    ]
  },
  "alpha": {
    "type": "CLinearFunction",
    "subType": "Number",
    "keys": [
      { "value": 1, "pos": 0 },
      { "value": 0, "pos": 1 }
    ]
  }
}
```

### RandomColorBetweenGradient

```json
{
  "type": "RandomColorBetweenGradient",
  "gradient1": { "type": "Gradient" },
  "gradient2": { "type": "Gradient" }
}
```

## Vector and Rotation Generators

### Vector3Function

```json
{
  "type": "Vector3Function",
  "x": { "type": "ConstantValue", "value": 0 },
  "y": { "type": "IntervalValue", "a": -1, "b": 1 },
  "z": { "type": "ConstantValue", "value": 0 }
}
```

### AxisAngle

```json
{
  "type": "AxisAngle",
  "axis": { "x": 0, "y": 1, "z": 0 },
  "angle": { "type": "ConstantValue", "value": 0 }
}
```

### Euler

```json
{
  "type": "Euler",
  "angleX": { "type": "ConstantValue", "value": 0 },
  "angleY": { "type": "IntervalValue", "a": 0, "b": 6.283185307179586 },
  "angleZ": { "type": "ConstantValue", "value": 0 }
}
```

### RandomQuat

```json
{ "type": "RandomQuat" }
```

## Sequencer Payload Used by ApplySequences

### TextureSequencer

```json
{
  "type": "TextureSequencer",
  "scaleX": 1,
  "scaleY": 1,
  "position": [0, 0, 0],
  "locations": [
    { "x": 0, "y": 0 },
    { "x": 10, "y": 10 }
  ]
}
```
