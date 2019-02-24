# FYSX
FYSX is a physics library written in TypeScript. It's designed to be flexible and extendible.

```
npm i fysx
```

## Getting Started

Check out the examples in the ``examples`` folder.

## Overview

FYSX's physics algorithm is based on Verlet integration. So vertices and constraints are the "fundamental building blocks" of the physical world.

### Vertex

A ``Vertex`` is a single particle in space. It has a position and a previous position (which is used to calculate it's velocity).

### Constraint

A ``Constraint`` is a "connection" between one or more vertices. They come in different types. They usually apply a force to one or more of the "connected" vertices depending on their current state.

Types of constraints:
* *Distance Constraint:* Tries to keep two vertices at a constant distance for each other by pushing/pulling them towards/from one another.
* *Leash Constraint:* Force one vertex to stay within a radius of the other vertex by pulling the vertex inside the radius when it's outside.
* *Pin Constraint:* Pins a vertex to a point in space. The vertex is forced to stay at that point at all times.

### Mesh

A ``Mesh`` is a polygon which has vertices as corners. It has no impact on the physics simulation. It can be used to texture bodies, or otherwise render parts of the simulation.

### Body

``Body`` is a group of vertices, constraints and meshes.

### World

A ``World`` is where all the vertices, constraints, meshes and bodies live. Only physical objects in the same world can interact with each other.
