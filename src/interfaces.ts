import { IBody } from './Body';
import { IVertex } from './Vertex';
import { IVec2 } from './Vec2';
import { EventEmitter } from './EventEmitter';

/** Generic Dictionary Type. */
export type IDict<T> = { [key: string]: T };

/** Generic 2D Point. */
export interface IPoint {
  x: number;
  y: number;
}

/** Verlet Constraint */
export interface IConstraint {
  /** Body the constraint belongs to. */
  parent: IBody;
  /**
   * If this constraint is an edge.
   * Edge constraints can collide with other constraint, non-edge constraint can not.
   */
  edge: boolean;
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

/**
 * A polygon with its corners defined by vertices.
 * Mainly used for rendering a whole, or parts of a, body.
 */
export interface IMesh {
  parent: IBody;
  name: string;
  texture: any;
  vertices: IVertex[];
  indices: number[];
  uvs: number[];
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
export interface ICollidable extends EventEmitter {
  gravity: IPoint;
  mass: number;
  /** If the object can not be moved from collisions. */
  isImmovable: boolean;
}
