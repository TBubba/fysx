import { IConstraint, ICollidable } from './interfaces';
import { IVertex, integrateVertices } from './Vertex';
import { IZone } from './Zone';
import { IBody } from './Body';
import { ICollision, Collision } from './Collision';
import { isBodyInZone } from './util';
import { IEventEmitter, EventEmitter } from './EventEmitter';

interface ICollisionLink {
  c0: ICollidable;
  c1: ICollidable;
}

export interface IWorld extends IEventEmitter {
  /** Number of iterations per frame. */
  kNumIterations: number;
  kFriction: number;
  kFrictionGround: number;
  kViscosity: number;
  kForceDrag: number;

  /** If the vertices should stay inside the world borders (between {0, 0} and {world.width, world.height}). */
  hasBorders: boolean;
  /** X coordinate of the right-most side of the world border. */
  width: number;
  /** Y coordinate of the bottom-most side of the world border. */
  height: number;

  bodies: IBody[];
  zones: IZone[];
  vertices: IVertex[];
  constraints: IConstraint[];

  collision: ICollision;

  /** Process the next frame. */
  frame(): void;
  /**
   * Add a body to the world.
   * @param body Body to add to the world.
   * @returns If the body was successfully added to the world.
   */
  addBody(body: IBody): boolean;
  /**
   * Remove a body from the world.
   * @param body Body to remove from the world.
   * @returns If the body was successfully removed from the world.
   */
  removeBody(body: IBody): boolean;
  /**
   * Add a zone to the world.
   * @param zone Zone to add to the world.
   * @returns If the zone was successfully added to the world.
   */
  addZone(zone: IZone): boolean;
  /**
   * Remove a zone from the world.
   * @param zone Zone to remove from the world.
   * @returns If the zone was successfully removed from the world.
   */
  removeZone(zone: IZone): boolean;
}

export class World extends EventEmitter implements IWorld {
  kNumIterations: number = 8;
  kFriction: number = 0.2;
  kFrictionGround: number = 0.2;
  kViscosity: number = 1.0;
  kForceDrag: number = 5;

  hasBorders: boolean = false;
  width: number = 0;
  height: number = 0;
  
  bodies: IBody[] = [];
  zones: IZone[] = [];
  vertices: IVertex[] = [];
  constraints: IConstraint[] = [];

  collision: ICollision = new Collision(this);

  frame(): void {
    // Integrate
    integrateVertices(this.vertices, this);
    
    // Solve
    const collision = this.collision;
    for (let n = 0; n < this.kNumIterations; n++) {
      const nBodies = this.bodies.length;
      const nConstraints = this.constraints.length;
      const nZones = this.zones.length;

      // -- Solve Constraints --
  
      for (let i = 0; i < nConstraints; i++) {
        this.constraints[i].solve();
      }
  
      // -- Recalculate the bounding boxes --
      
      for (let i = 0; i < nBodies; i++) {
        this.bodies[i].updateBoundingBox();
      }
  
      for (let i = 0; i < nZones; i++) {
        this.zones[i].updateBoundingBox();
      }

      // -- Collisions Detection --
  
      const collisions: ICollisionLink[] = []; // (Store an object per collision that will be used to create event emits)

      // Check collision (all bodies against all other bodies, and all zones)
      for (let i = 0; i < nBodies; i++) {
        const body0 = this.bodies[i];
        const b0Layers = body0.layers;
        if (b0Layers === 0) { continue; } // (if .layers is 0, the body can not collide with anything)
        // Check collision with all other bodies
        for (let j = i + 1; j < nBodies; j++) {
          const body1 = this.bodies[j];
          // Check if bodies' .layers share at least one "positive bit"
          if ((b0Layers & body1.layers) !== 0) {
            // Check if they collide
            if (collision.SAT(body0, body1)) {
              // Resolve collision
              collision.resolve();
              // Add collision to array
              collisions.push({
                c0: body0,
                c1: body1
              });
            }
          }
        }
        // Check collision with all zones
        for (let j = 0; j < nZones; j++) {
          const zone = this.zones[j];
          // Check if body's and zone's .layers share at least one "positive bit"
          if ((b0Layers & zone.layers) !== 0) {
            // Add collision to array
            if (isBodyInZone(body0, zone)) {
              collisions.push({
                c0: body0,
                c1: zone
              });
            }
          }
        }
      }
  
      // Emit events of bodies that collide
      // (This is done afterwards because then all bodies are updated, and we can safely add and remove bodies)
      const collisionsLength = collisions.length;
      for (let i = 0; i < collisionsLength; i++) {
        const c = collisions[i];
        // Emit events
        c.c0.emit('collide', c.c1, c.c0);
        c.c1.emit('collide', c.c0, c.c1);
      }
    }
  }
  
  addBody(body: IBody): boolean {
    const index = this.bodies.indexOf(body);
    if (index !== -1) { return false; }
  
    // Add body to array
    this.bodies.push(body);
  
    // Add body's vertices and constraints to world
    const push = Array.prototype.push;
    push.apply(this.vertices,    body.vertices.array);
    push.apply(this.constraints, body.constraints);

    this.emit('add_body', body, this.bodies.length - 1);

    return true;
  }
  
  removeBody(body: IBody): boolean {
    const index = this.bodies.indexOf(body);
    if (index === -1) { return false; } // (Body not found in array)
  
    // Remove body from array
    this.bodies.splice(index, 1);
  
    // Remove body's vertices and constraints from world
    remove(this.vertices, body.vertices.array);
    remove(this.constraints, body.constraints);

    this.emit('remove_body', body, index);
    
    return true;
  }

  addZone(zone: IZone): boolean {
    const index = this.zones.indexOf(zone);
    if (index !== -1) { return false; }
  
    // Add zone to array
    this.zones.push(zone);
    
    this.emit('add_zone', zone, this.zones.length - 1);

    return true;
  }

  removeZone(zone: IZone): boolean {
    const index = this.zones.indexOf(zone);
    if (index === -1) { return false; }
    
    // Remove zone from array
    this.zones.splice(index, 1);

    this.emit('remove_zone', zone, index);

    return true;
  }
}

/** Remove all elements in "target" that also is in "dupes" */
function remove<T>(target: T[], dupes: T[]): void {
  for (let i = target.length - 1; i >= 0; i--) {
    const v0 = target[i];
    for (let j = dupes.length - 1; j >= 0; j--) {
      const v1 = dupes[j];
      if (v0 === v1) { target.splice(i, 1); }
    }
  }
}
