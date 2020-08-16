import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { Vec2 } from '../Vec2';

/**
 * Angle Constraint.
 */
export class AngleConstraint<T extends IBody> implements IConstraint<T> {
  parent: T;
  v0: IVertex<T>;
  v1: IVertex<T>;
  v2: IVertex<T>;
  angle: number;
  stiff: number;

  constructor(parent: T, v0: IVertex<T>, v1: IVertex<T>, v2: IVertex<T>, angle = 0, stiff = 0.1) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
    this.v2 = v2;
    this.angle = angle;
    this.stiff = stiff;
  }

  solve(): void {
    const p0 = this.v0.position;
    const p1 = this.v1.position;
    const p2 = this.v2.position;
    
    let dif = p0.angleTo(p1) + this.angle - p0.angleTo(p2);
    if      (dif <= -Math.PI) { dif += Math.PI * 2; }
    else if (dif >=  Math.PI) { dif -= Math.PI * 2; }

    dif *= this.stiff * 0.5;

    p1.rotate(p0, -dif);
    p2.rotate(p0, dif);
    //p0.rotate(p1, dif);
    //p0.rotate(p2, -dif);
  }
}
