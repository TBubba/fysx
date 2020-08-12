import { IWorld } from './World';
import { IVec2, Vec2 } from './Vec2';
import { IAxis } from './interfaces';
import { IVertex } from './Vertex';
import { IBody } from './Body';
import { createAxis, projectAxis } from './util';
import { IEdge } from './Edge';

export interface ICollision {
  /**
   * Separating Axis Theorem collision test between two bodies. This checks whether or not
   * two bodies collide with each other and has to be resolved.
   * @param B0 First body to check collision with
   * @param B1 Second body to check collision with
   * @returns Whether or not the two bodies should have their collision resolved.
   */
  SAT(B0: IBody, B1: IBody): boolean;
  /**
   * Collision Resolution between two bodies.
   * IMPORTANT:
   * This should only be called right after "SAT" and only if "SAT" returned true.
   */
  resolve(): void;
}

export class Collision implements ICollision {
  world: IWorld | undefined;
  testAxis: IVec2 = new Vec2();
  b0Axis: IAxis = createAxis();
  b1Axis: IAxis = createAxis();
  axis: IVec2 = new Vec2();
  center: IVec2 = new Vec2();
  line: IVec2 = new Vec2();
  response: IVec2 = new Vec2();
  relVel: IVec2 = new Vec2();
  tangent: IVec2 = new Vec2();
  relTanVel: IVec2 = new Vec2();
  depth: number = 0;
  edge: IEdge<IBody> | undefined;
  vertex: IVertex<IBody> | undefined;

  constructor(world?: IWorld) {
    this.world = world;
  }

  SAT(B0: IBody, B1: IBody): boolean {
    // -- AABB overlap test --
    
    if (
      !(0 > Math.abs(B1.center.x - B0.center.x) - (B1.halfEx.x + B0.halfEx.x) &&
        0 > Math.abs(B1.center.y - B0.center.y) - (B1.halfEx.y + B0.halfEx.y))
    ) { return false; } // (no AABB overlap)
  
    // -- SAT collision detection --

    const n0 = B0.edges.length;
    const n1 = B1.edges.length;
  
    // Abort if at least one body has no edges (only edges can collide)
    if (n0 === 0 || n1 === 0) { return false; }
  
    // Iterate through all of the edges of both bodies
    let minDistance = Number.MAX_VALUE;
    for (let i = 0, n = n0 + n1; i < n; i++) {
      // Get edge (first all from B0, then all from B1)
      const edge = i < n0 ? B0.edges[i] : B1.edges[i - n0];
      // Calculate the perpendicular to this edge and normalize it
      this.testAxis.normal(edge.v0.position, edge.v1.position);
      // Project both bodies onto the normal
      projectAxis(B0.vertices.array, this.testAxis, this.b0Axis);
      projectAxis(B1.vertices.array, this.testAxis, this.b1Axis);
      //Calculate the distance between the two intervals
      const dist = this.b0Axis.min < this.b1Axis.min ? this.b1Axis.min - this.b0Axis.max : this.b0Axis.min - this.b1Axis.max;
      // If the intervals don't overlap, return, since there is no collision
      if (dist > 0) return false;
      else if (Math.abs(dist) < minDistance) {
        minDistance = Math.abs(dist);
        // Save collision information
        this.axis.copy(this.testAxis);
        this.edge = edge;
      }
    }
  
    // Remember the shortest distance
    this.depth = minDistance;
  
    // Ensure collision edge in B1 and collision vertex in B0
    if (this.edge && this.edge.parent !== B1) {
      let temp = B1;
      B1 = B0;
      B0 = temp;
    }
  
    // Make sure that the collision normal is pointing at B1
    const n = this.center.copy(B0.center).sub(B1.center).dot(this.axis); //var n = this.center.cool_sub(B0.center, B1.center).dot(this.axis);
  
    // Revert the collision normal if it points away from B1
    if (n < 0) { this.axis.neg(); }
  
    let smallestDist = Number.MAX_VALUE;
    
    const B0VerticesArray = B0.vertices.array;
    const vCount = B0VerticesArray.length;
    for (let i = 0; i < vCount; i++) {
      // Measure the distance of the vertex from the line using the line equation
      const v = B0VerticesArray[i];
      this.line.copy(v.position).sub(B1.center); //this.line.cool_sub(v.position, B1.center);
      const dist = this.axis.dot(this.line);
      // Set the smallest distance and the collision vertex
      if (dist < smallestDist) {
        smallestDist = dist;
        this.vertex = v;
      }
    }
  
    // There is no separating axis. Report a collision!
    return true;
  }

  resolve(): void {
    const edge = this.edge;
    const vertex = this.vertex;
    const world = this.world;
    if (!edge)   { throw new Error('Resolve failed. Edge is missing.'); }
    if (!vertex) { throw new Error('Resolve failed. Vertex is missing.'); }
    if (!world)  { throw new Error('Resolve failed. World is missing.'); }

    // Cache the isImmovable flag of both bodies
    const s0 = edge.parent.isImmovable,
          s1 = vertex.parent.isImmovable;
  
    // Don't resolve collision if both bodies are static (neither should be moved)
    if (s0 && s1) { return; }

    // cache vertices positions
    const p0 = edge.v0.position,
          p1 = edge.v1.position,
          o0 = edge.v0.oldPosition,
          o1 = edge.v1.oldPosition,
          vp = vertex.position,
          vo = vertex.oldPosition,
          rs = this.response;
  
    // response vector
    rs.copy(this.axis).scaleAll(this.depth); //this.response.cool_scale(this.axis, this.depth);
  
    // calculate where on the edge the collision vertex lies
    const t = Math.abs(p0.x - p1.x) > Math.abs(p0.y - p1.y)
      ? (vp.x - rs.x - p0.x) / (p1.x - p0.x)
      : (vp.y - rs.y - p0.y) / (p1.y - p0.y);
    const lambda = 1 / (t * t + (1 - t) * (1 - t));
  
    // Calculate mass co-efficient (unless one of the bodies is static)
    let m0 = 0, m1 = 0;
    if      (s0) { m1 = 1; }
    else if (s1) { m0 = 1; }
    else {
      m0 = vertex.parent.mass;
      m1 = edge.parent.mass;
    }
    const tm = m0 + m1;
    m0 = m0 / tm,
    m1 = m1 / tm;
  
    // apply the collision response
    const a0  = (1 - t) * lambda * m0;
    const a1 =       t  * lambda * m0;
    p0.subXY(rs.x * a0,
             rs.y * a0);
    p1.subXY(rs.x * a1,
             rs.y * a1);
  
    vp.x += rs.x * m1;
    vp.y += rs.y * m1;
  
    //
    // collision friction
    //
  
    // compute relative velocity
    this.relVel.set(
      vp.x - vo.x - (p0.x + p1.x - o0.x - o1.x) * 0.5,
      vp.y - vo.y - (p0.y + p1.y - o0.y - o1.y) * 0.5
    );
  
    // axis perpendicular
    this.tangent.perp(this.axis);
  
    // project the relative velocity onto tangent
    const relTv = this.relVel.dot(this.tangent);
    const rt = this.relTanVel.set(this.tangent.x * relTv, this.tangent.y * relTv);
  
    // apply tangent friction
    const b = world.kFriction * m1;
    vo.addXY(rt.x * b,
             rt.y * b);
  
    const c0 = (1 - t) * world.kFriction * lambda * m0;
    const c1 =      t  * world.kFriction * lambda * m0;
    o0.subXY(rt.x * (1 - t) * c0,
             rt.y * (1 - t) * c0);
    o1.subXY(rt.x * c1,
             rt.y * c1);
  }
}
