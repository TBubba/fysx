import { IVertex } from './Vertex';
import { IConstraint, IMesh, IBoundingBox, ICollidable } from './interfaces';
import { IVec2, Vec2 } from './Vec2';
import { IPerfDict, PerfDict } from './PerfDict';
import { calculateBodyBoundingBox } from './util';
import { EventEmitter } from './EventEmitter';

/** Physics Body. */
export interface IBody<T = any> extends IBoundingBox, ICollidable<T> {
  edges: IConstraint<T>[];
  constraints: IConstraint<T>[];
  meshes: IMesh<T>[];
  
  /**
   * Add a constraint.
   * @param constraint Constraint to add.
   */
  addConstraint(constraint: IConstraint<T>): void;
  /**
   * Remove a constraint.
   * @param constraint Constraint to remove
   * @returns If the constraint was found and removed.
   */
  removeConstraint(constraint: IConstraint<T>): boolean;
}

export class Body<T = any> extends EventEmitter implements IBody<T> {
  vertices: IPerfDict<IVertex<T>> = new PerfDict();
  edges: IConstraint<T>[] = [];
  constraints: IConstraint<T>[] = [];
  meshes: IMesh<T>[] = [];
  center: IVec2 = new Vec2();
  halfEx: IVec2 = new Vec2();
  mass: number = 1;
  isImmovable: boolean = false;
  layers: number = 0x00000001;
  gravity: IVec2 = new Vec2();
  data: T | undefined = undefined;

  updateBoundingBox(): void {
    calculateBodyBoundingBox(this.vertices.array, this);
  }

  addConstraint(constraint: IConstraint<T>): void {
    this.constraints.push(constraint);
    if (constraint.edge) { this.edges.push(constraint); }
  }

  removeConstraint(constraint: IConstraint<T>): boolean {
    const index = this.constraints.indexOf(constraint);
    if (index === -1) { return false; }
    this.constraints.splice(index, 1);
    
    const edgeIndex = this.edges.indexOf(constraint);
    if (edgeIndex >= 0) { this.edges.splice(edgeIndex, 1); }

    return true;
  }
}
