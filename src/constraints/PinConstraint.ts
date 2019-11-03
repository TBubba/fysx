import { IConstraint, IPoint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2, Vec2 } from '../Vec2';

/**
 * Pin Constraint.
 * It "pins" a vertex to a specific point in space.
 */
export class PinConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  v0: IVertex<T>;
  p1: IVec2 = new Vec2();
  dist2: number = 0;

  constructor(parent: T, v0: IVertex<T>, p1: IPoint) {
    this.parent = parent;
    this.v0 = v0;
    this.p1.copy(p1);
  }

  solve(): void {
    this.v0.position.copy(this.p1);
  }
}
