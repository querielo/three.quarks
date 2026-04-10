# Emitter Shapes

`shape` inside `ps` defines spawn position and initial direction logic.

## Common Optional Fields (Most Shapes)

- `mode`: 0 Random, 1 Loop, 2 PingPong, 3 Burst
- `spread`: quantization step for sampled position over emitter path
- `speed`: generator driving progression for non-random modes

## Point

```json
{ "type": "point" }
```

## Sphere

```json
{
  "type": "sphere",
  "radius": 1,
  "thickness": 1,
  "arc": 6.283185307179586,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## Hemisphere

```json
{
  "type": "hemisphere",
  "radius": 1,
  "thickness": 1,
  "arc": 6.283185307179586,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## Cone

```json
{
  "type": "cone",
  "radius": 1,
  "angle": 0.5,
  "thickness": 1,
  "arc": 6.283185307179586,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## Donut

```json
{
  "type": "donut",
  "radius": 10,
  "donutRadius": 2,
  "thickness": 1,
  "arc": 6.283185307179586,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## Circle

```json
{
  "type": "circle",
  "radius": 1,
  "thickness": 1,
  "arc": 6.283185307179586,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## Grid

```json
{
  "type": "grid",
  "width": 10,
  "height": 10,
  "column": 10,
  "row": 10
}
```

## Rectangle

```json
{
  "type": "rectangle",
  "width": 10,
  "height": 10,
  "thickness": 1,
  "mode": 0,
  "spread": 0,
  "speed": { "type": "ConstantValue", "value": 1 }
}
```

## MeshSurface (plugin shape)

```json
{
  "type": "mesh_surface",
  "geometry": "geometry-uuid"
}
```

Key mismatch note (important):

- Some payloads use `geometry`.
- Some payloads use `mesh`.

Examples:

```json
{ "type": "mesh_surface", "geometry": "geometry-uuid" }
```

```json
{ "type": "mesh_surface", "mesh": "geometry-uuid" }
```

Migration recommendation:

- Prefer writing `geometry` for new data.
- If consuming external JSON, normalize `mesh` -> `geometry` before load when needed.
