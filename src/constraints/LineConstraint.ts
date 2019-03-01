import { IConstraint } from '../interfaces';
import { IBody } from '../Body';
import { IVertex } from '../Vertex';
import { IVec2 } from '../Vec2';

/**
 * Line Constraint.
 * It does not constrain the vertices at all, instead it only acts as a line between the two.
 * Useful for edges of static bodies.
 */
export class LineConstraint implements IConstraint {
  parent: IBody;
  edge: boolean;
  v0: IVertex;
  v1: IVertex;

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

  solve(): void { /* Don't do anything */ }
}
