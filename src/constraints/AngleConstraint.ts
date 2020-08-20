import { IBody } from '../Body';
import { IConstraint } from '../interfaces';
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
    this.min = angle(min);
    this.max = angle(max);
    this.pow = pow;
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
    const p2 = this.v2.position;

    const a1 = angle(p0.angleTo(p1));
    const a2 = angle(p0.angleTo(p2));

    const range = Math.abs(this.max - this.min) * 0.5;
    const dif = angle(angle(a1 + this.min - range) - a2);

    if (Math.abs(dif) > range) {
      const rot = (dif - range * sign(dif));
      p2.rotate(p0,  rot * this.pow);
      p1.rotate(p0, -rot * (1 - this.pow));
    }
  }
}

/** Simplify an angle to a range between [-PI, PI]. */
function angle(angle: number): number {
  return (Math.abs(angle) > Math.PI)
    ? angle + (((angle / (Math.PI * 2)) | 0) - sign(angle)) * (Math.PI * 2)
    : angle;
}

function sign(x: number): number {
  return x ? x < 0 ? -1 : 1 : 0;
}
