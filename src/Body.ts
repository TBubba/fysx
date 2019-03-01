import { IVertex } from './Vertex';
import { IConstraint, IBoundingBox, IWorldObject } from './interfaces';
import { IVec2, Vec2 } from './Vec2';
import { IPerfDict, PerfDict } from './PerfDict';
import { calculateBoundingBox } from './util';
import { EventEmitter } from './EventEmitter';
import { IEdge } from './Edge';

/** Physics Body. */
export interface IBody extends IBoundingBox, IWorldObject {
  /** Vertices of the body. */
  vertices: IPerfDict<IVertex<this>>;
  /** Constraints of the body. */
  constraints: IConstraint<this>[];
  /** Edges of the body. */
  edges: IEdge<this>[];
  /** Gravity of all vertices of the body. */
  gravity: IVec2;
  /** Mass of each vertex in the body. */
  mass: number;
  /** If the body can not be moved from collisions. */
  isImmovable: boolean;
  
  /**
   * Add a constraint.
   * @param constraint Constraint to add.
   */
  addConstraint(constraint: IConstraint<this>): void;
  /**
   * Remove a constraint.
   * @param constraint Constraint to remove
   * @returns If the constraint was found and removed.
   */
  removeConstraint(constraint: IConstraint<this>): boolean;
}

export class Body extends EventEmitter implements IBody {
  vertices: IPerfDict<IVertex<this>> = new PerfDict();
  edges: IEdge<this>[] = [];
  constraints: IConstraint<this>[] = [];
  center: IVec2 = new Vec2();
  halfEx: IVec2 = new Vec2();
  mass: number = 1;
  isImmovable: boolean = false;
  layers: number = 0x00000001;
  gravity: IVec2 = new Vec2();

  updateBoundingBox(): void {
    calculateBoundingBox(this.vertices.array, this);
  }

  addConstraint(constraint: IConstraint<this>): void {
    this.constraints.push(constraint);
  }

  removeConstraint(constraint: IConstraint<this>): boolean {
    const index = this.constraints.indexOf(constraint);
    if (index === -1) { return false; }
    this.constraints.splice(index, 1);
    return true;
  }
}
