import { IVec2 } from './Vec2';
import { EventEmitter } from './EventEmitter';
import { IBody } from './Body';

/** Generic Dictionary Type. */
export type IDict<T> = { [key: string]: T };

/** Generic 2D Point. */
export interface IPoint {
  x: number;
  y: number;
}

/** Verlet Constraint */
export interface IConstraint<T extends IBody = IBody> {
  /** Body the constraint belongs to. */
  parent: T;
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
export interface IWorldObject extends EventEmitter {
  /** The layers this can interact on. */
  layers: number;
  /** Update the bounding box (center and halfEx). */
  updateBoundingBox(): void;
}
