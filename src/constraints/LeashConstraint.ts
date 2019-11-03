import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2 } from '../Vec2';

/**
 * Leash Constraint.
 * It constraints v1 from getting too far away from v0.
 * (When the distance between them is greater than "dist", it will pull
 *  v1 to v0 until their distance is smaller than "dist")
 */
export class LeashConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  /** Vertex that "holds" the leash. */
  v0: IVertex<T>;
  /** Vertex that is "bound" by the leash. */
  v1: IVertex<T>;
  /** Maximum distance between the vertices before the leash pulls one towards the other. */
  dist: number = 0;
  /** Maximum distance squared. Cached for performance reasons. */
  dist2: number = 0;

  constructor(parent: T, v0: IVertex<T>, v1: IVertex<T>, dist: number) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.setDistance(dist);
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
  
    const dx  = p1.x - p0.x;
    const dy  = p1.y - p0.y;
    const dl2 = dx*dx + dy*dy;
    if (dl2 > this.dist2) {
      const s = (1 / Math.sqrt(dl2)) * this.dist;
      p1.x = p0.x + dx * s;
      p1.y = p0.y + dy * s;
    }
  }

  /** Set the maximum distance between the vertices */
  setDistance(dist: number): void {
    this.dist = dist;
    this.dist2 = dist * dist;
  }
}
