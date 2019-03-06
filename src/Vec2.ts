import { IPoint } from './interfaces';

/**
 * Generic 2D Vector with plenty of chain-able methods.
 */
export interface IVec2 extends IPoint {
  /** Set the values of this vector. */
  set(x: number, y: number): this;
  /** Copy the values from another vector to this. */
  copy(v: IPoint): this;
  /** Flip the sign flag of the values. */
  neg(): this;
  /** Add the values of another vector to this. */
  add(v: IPoint): this;
  /** Add to the values of this vector. */
  addXY(x: number, y: number): this;
  /** Subtract from the values of this vector. */
  sub(v: IPoint): this;
  /** Subtract from the values of this vector. */
  subXY(x: number, y: number): this;
  /** Scale the values of this vector by the values of another. */
  scale(v: IPoint): this;
  /** Scale the values of this vector. */
  scaleXY(x: number, y: number): this;
  /** Scale the values of this vector by the same factor. */
  scaleAll(scale: number): this;
  /** Square the values of this vector (multiply each value with itself).*/
  square(): this;
  /** Set the values of this vector to be the perpendicular of another vector. */
  perp(v: IPoint): this;
  /** Rotate this around another vector. */
  rotate(origin: IPoint, theta: number): this;
  /** Rotate this around the origin (origin is {0, 0}). */
  spin(theta: number): this;
  /** some advanced thing that should probably be split into several methods. */
  normal(v0: IPoint, v1: IPoint): this;
  /** Calculate the squared distance to another vector. */
  squareDistanceTo(v: IPoint): number;
  /** Calculate the distance to another vector. */
  distanceTo(v: IPoint): number;
  /** Calculate the squared length of this vector (squared distance to {0, 0}). */
  squareLength(): number;
  /** Calculate the length of this vector (distance to {0, 0}). */
  length(): number;
  /** Calculate the dot product of this and another vector. */
  dot(v: IPoint): number;
  /** Calculate the angle of a line between this and another vector. */
  angleTo(v: IPoint): number;
  /** Calculate the angle of a line between this and the origin (origin is {0, 0}). */
  angle(): number;
  /** Normalize this vector. */
  normalize(): this;
  /** Round the values to the nearest whole number. */
  round(): this;
  /** Create a new vector with values copied from this. */
  clone(): IVec2;
}

/** Generic 2D Vector Class. */
export class Vec2 implements IVec2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  
  copy(v: IPoint): this {
    this.x = v.x;
    this.y = v.y;
    return this;
  }
  
  neg(): this {
    this.x = -this.x;
    this.y = -this.y;
    return this;
  }
  
  add(v: IPoint): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }
  
  addXY(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }
  
  sub(v: IPoint): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }
  
  subXY(x: number, y: number): this{
    this.x -= x;
    this.y -= y;
    return this;
  }
  
  scale(v: IPoint): this {
    this.x *= v.x;
    this.y *= v.y;
    return this;
  }
  
  scaleXY(x: number, y: number): this {
    this.x *= x;
    this.y *= y;
    return this;
  }
  
  scaleAll(scale: number): this {
    this.x *= scale;
    this.y *= scale;
    return this;
  }
  
  perp(v: IPoint): this {
    this.x = -v.y;
    this.y = v.x;
    return this;
  }
  
  square(): this {
    this.x *= this.x;
    this.y *= this.y;
    return this;
  }
  
  rotate(origin: IPoint, theta: number): this {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const x = this.x - origin.x;
    const y = this.y - origin.y;
    this.set(x*cosTheta - y*sinTheta + origin.x,
             x*sinTheta + y*cosTheta + origin.y);
    return this;
  }
  
  spin(theta: number): this {
    const cosTheta = Math.cos(theta);
    const sinTheta = Math.sin(theta);
    const x = this.x;
    const y = this.y;
    this.x = x*cosTheta - y*sinTheta;
    this.y = x*sinTheta + y*cosTheta;
    return this;
  }
  
  normal(v0: IPoint, v1: IPoint): this {
    // perpendicular
    const nx = v0.y - v1.y,
        ny = v1.x - v0.x;
    // normalize
    const len = 1.0 / Math.sqrt(nx * nx + ny * ny);
    this.x = nx * len;
    this.y = ny * len;
    return this;
  }
  
  squareDistanceTo(v: IPoint): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return dx * dx + dy * dy;
  }
  
  distanceTo(v: IPoint): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
  
  squareLength(): number {
    return this.x * this.x + this.y * this.y;
  }
  
  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  
  dot(v: IPoint): number {
    return this.x * v.x + this.y * v.y;
  }
  
  angleTo(v: IPoint): number {
  return Math.atan2(v.y - this.y, v.x - this.x);
  }
  
  angle(): number {
    return Math.atan2(this.y, this.x); 
  }
  
  normalize(): this {
    const len = Math.sqrt(this.x * this.x + this.y * this.y);
    this.x = this.x / len;
    this.y = this.y / len;
    return this;
  }
  
  round(): this {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
    return this;
  }
  
  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  /**
   * Create a vector with length one pointing in a direction (radian).
   * @param rad Angle of direction in radians.
   * @returns Vector pointing in that direction with a length of one.
   */
  static fromRadian(rad: number): Vec2 {
    return new Vec2(Math.cos(rad), Math.sin(rad));
  }
  
  /**
   * Create a vector with values copied from a point.
   * @param point Point to copy values from.
   * @returns Vector with identical values as the point.
   */
  static fromPoint(point: IPoint): Vec2 {
    return new Vec2(point.x, point.y);
  }
}
