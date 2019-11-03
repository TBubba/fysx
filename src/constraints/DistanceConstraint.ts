import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2 } from '../Vec2';

/**
 * Distance Constraint.
 * It attempts to keep the distance between two vertices constant by pulling or
 * pushing them (towards / away from each other).
 */
export class DistanceConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  v0: IVertex<T>;
  v1: IVertex<T>;
  /** Target distance squared (squared for performance reasons) */
  dist2: number = 0;

  constructor(parent: T, v0: IVertex<T>, v1: IVertex<T>) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
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
