import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2 } from '../Vec2';

/**
 * Distance Constraint.
 * It attempts to keep the distance between two vertices constant by pulling or
 * pushing them (towards / away from each other).
 */
export class DistanceConstraint implements IConstraint {
  parent: IBody;
  edge: boolean;
  v0: IVertex;
  v1: IVertex;
  /** Target distance squared (squared for performance reasons) */
  dist2: number = 0;

  constructor(parent: IBody, v0: IVertex, v1: IVertex, edge: boolean = false) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.edge = edge;
  }
  
  getPosition0(): IVec2 {
    return this.v0.position;
  }
  
  getPosition1(): IVec2 {
    return this.v1.position;
  }
  
  getOldPosition0(): IVec2 {
    return this.v0.oldPosition;
  }
  
  getOldPosition1(): IVec2 {
    return this.v1.oldPosition;
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
    const dist2 = this.dist2;
  
    let dx = (p1.x - p0.x) || 0;
    let dy = (p1.y - p0.y) || 0;
  
    // Square root approximation
    const delta = dist2 / (dx*dx + dy*dy + dist2) - 0.5;
  
    dx *= delta;
    dy *= delta;
  
    p1.addXY(dx, dy);
    p0.subXY(dx, dy);
  }

  /**
   * Set the target distance.
   * This does the same as "setSquaredDistance" but this expects the real target distance.
   * @param dist Target distance.
   */
  setDistance(dist: number): void {
    this.dist2 = dist * dist;
  }

  /**
   * Set the target distance by the squared value.
   * This does the same as "setDistance" but this expects the target distance squared.
   * @param dist2 Square of target distance.
   */
  setSquaredDistance(dist2: number): void {
    this.dist2 = dist2;
  }
}
