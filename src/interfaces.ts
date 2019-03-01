import { IBody } from './Body';
import { IVertex } from './Vertex';
import { IVec2 } from './Vec2';
import { EventEmitter } from './EventEmitter';
import { IPerfDict } from './PerfDict';

/** Generic Dictionary Type. */
export type IDict<T> = { [key: string]: T };

/** Generic 2D Point. */
export interface IPoint {
  x: number;
  y: number;
}

/** Verlet Constraint */
export interface IConstraint<T = any> {
  /** Body the constraint belongs to. */
  parent: IBody<T>;
  /** Get the first position. */
  getPosition0(): IVec2;
  /** Get the second position. */
  getPosition1(): IVec2;
  /** Get the first old position. */
  getOldPosition0(): IVec2;
  /** Get the second old position. */
  getOldPosition1(): IVec2;
  /** Apply the constraint to the related vertices. */
  solve(): void;
}

/** A rectangular shape. */
export interface IBoundingBox {
  /** Center of the bounding box. */
  center: IVec2;
  /** Half the size of the bounding box. */
  halfEx: IVec2;
}

export interface IAxis {
  min: number;
  max: number;
}

export interface ILineIntersectionResult {
  x: number;
  y: number;
  /** If the collision is within the start and end points of the first line segment. */
  onLine1: boolean;
  /** If the collision is within the start and end points of the second line segment. */
  onLine2: boolean;
}

/** An object that can collide and be collided with. */
export interface ICollidable<T> extends EventEmitter {
  vertices: IPerfDict<IVertex>;
  layers: number;
  gravity: IVec2;
  data: T | undefined;
  mass: number;
  /** If the object can not be moved from collisions. */
  isImmovable: boolean;
  
  /** Update the bounding box (center and halfEx). */
  updateBoundingBox(): void;
}
