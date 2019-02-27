import { IConstraint, IPoint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2, Vec2 } from '../Vec2';

/**
 * Pin Constraint.
 * It "pins" a vertex to a specific point in space.
 */
export class PinConstraint implements IConstraint {
  parent: IBody;
  edge: boolean;
  v0: IVertex;
  p1: IVec2 = new Vec2();
  dist2: number = 0;

  constructor(parent: IBody, v0: IVertex, p1: IPoint, edge: boolean = false) {
    this.parent = parent;
    this.v0 = v0;
    this.p1.copy(p1);
    this.edge = edge;
  }
  
  getPosition0(): IVec2 {
    return this.v0.position;
  }
  
  getPosition1(): IVec2 {
    return this.p1;
  }
  
  getOldPosition0(): IVec2 {
    return this.v0.oldPosition;
  }
  
  getOldPosition1(): IVec2 {
    return this.p1;
  }

  solve(): void {
    this.v0.position.copy(this.p1);
  }
}