import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';

/**
 * Angle Constraint.
 */
export class AngleConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  v0: IVertex<T>;
  v1: IVertex<T>;
  v2: IVertex<T>;
  angle: number;

  constructor(parent: T, v0: IVertex<T>, v1: IVertex<T>, v2: IVertex<T>, angle: number = 0) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.angle = angle;
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
    const p2 = this.v2.position;
    
    const angle = p0.angleTo(p1) + this.angle;
    const dist = p0.distanceTo(p2);

    p2.set(
      Math.cos(angle) * dist,
      Math.sin(angle) * dist
    );
  }
}
