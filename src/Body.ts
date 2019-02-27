import { IVertex } from './Vertex';
import { IConstraint, IMesh, IBoundingBox, IAxis, IPoint, ICollidable } from './interfaces';
import { IVec2, Vec2 } from './Vec2';
import { IPerfDict, PerfDict } from './PerfDict';
import { calculateBodyBoundingBox, projectAxis } from './util';
import { EventEmitter } from './EventEmitter';

/** Physics Body. */
export interface IBody<T = any> extends IBoundingBox, IAxis, ICollidable {
  vertices: IPerfDict<IVertex>;
  edges: IConstraint[];
  constraints: IConstraint[];
  meshes: IMesh[];
  layers: number;
  gravity: IVec2;
  data: T | undefined;

  /** Update the bounding box (center and halfEx). */
  updateBoundingBox(): void;
  /**
   * ???
   * @param axis 
   */
  projectAxis(axis: IPoint): void;
  /**
   * Add a constraint.
   * @param constraint Constraint to add.
   */
  addConstraint(constraint: IConstraint): void;
  /**
   * Remove a constraint.
   * @param constraint Constraint to remove
   * @returns If the constraint was found and removed.
   */
  removeConstraint(constraint: IConstraint): boolean;
}

export class Body<T = any> extends EventEmitter implements IBody<T> {
  vertices: IPerfDict<IVertex> = new PerfDict();
  edges: IConstraint[] = [];
  constraints: IConstraint[] = [];
  meshes: IMesh[] = [];
  center: IVec2 = new Vec2();
  halfEx: IVec2 = new Vec2();
  min: number = 0;
  max: number = 0;
  mass: number = 1;
  isImmovable: boolean = false;
  layers: number = 0x00000001;
  gravity: IVec2 = new Vec2();
  data: T | undefined = undefined;

  updateBoundingBox(): void {
    calculateBodyBoundingBox(this.vertices.array, this);
  }

  projectAxis(axis: IPoint): void {
    projectAxis(this.vertices.array, axis, this);
  }

  addConstraint(constraint: IConstraint): void {
    this.constraints.push(constraint);
    if (constraint.edge) { this.edges.push(constraint); }
  }

  removeConstraint(constraint: IConstraint): boolean {
    const index = this.constraints.indexOf(constraint);
    if (index === -1) { return false; }
    this.constraints.splice(index, 1);
    
    const edgeIndex = this.edges.indexOf(constraint);
    if (edgeIndex >= 0) { this.edges.splice(edgeIndex, 1); }

    return true;
  }
}
