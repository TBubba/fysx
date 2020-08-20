import { IBody } from '../Body';
import { IConstraint } from '../interfaces';
import { simplifyAngle } from '../util';
import { IVertex } from '../Vertex';

/**
 * Angle Constraint.
 */
export class AngleConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  v0: IVertex<T>;
  v1: IVertex<T>;
  v2: IVertex<T>;
  min: number;
  max: number;
  pow: number;

  constructor(parent: T, v0: IVertex<T>, v1: IVertex<T>, v2: IVertex<T>, min = 0, max = 0, pow = 0.5) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.min = simplifyAngle(min);
    this.max = simplifyAngle(max);
    this.pow = pow;
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
    const p2 = this.v2.position;

    const a1 = simplifyAngle(p0.angleTo(p1));
    const a2 = simplifyAngle(p0.angleTo(p2));

    const range = Math.abs(this.max - this.min) * 0.5;
    const dif = simplifyAngle(simplifyAngle(a1 + this.min + range) - a2);

    if (Math.abs(dif) > range) {
      const rot = (dif - range * Math.sign(dif));
      p2.rotate(p0,  rot * this.pow);
      p1.rotate(p0, -rot * (1 - this.pow));
    }
  }
}
