import { IVertex } from './Vertex';
import { Vec2, IVec2 } from './Vec2';
import { EventEmitter } from './EventEmitter';
import { IBoundingBox, IAxis, IPoint, ICollidable } from './interfaces';
import { calculateBodyBoundingBox, projectAxis } from './util';

export interface IZone<T = any> extends IBoundingBox, IAxis, ICollidable {
  vertices: IVertex[];
  layers: number;
  gravity: IVec2;
  data: T | undefined;

  /** Update the bounding box (center and halfEx). */
  updateBoundingBox(): void;
  /** ??? */
  projectAxis(axis: IPoint): void;
  
}

export class Zone<T = any> extends EventEmitter implements IZone<T> {
  vertices: IVertex[] = [];
  center: Vec2 = new Vec2();
  halfEx: Vec2 = new Vec2();
  min: number = 0;
  max: number = 0;
  mass: number = 0;
  isImmovable: boolean = true;
  layers: number = 0;
  gravity: IVec2 = new Vec2();
  data: T | undefined = undefined;

  updateBoundingBox(): void {
    calculateBodyBoundingBox(this.vertices, this);
  }

  projectAxis(axis: IPoint): void {
    projectAxis(this.vertices, axis, this);
  }
}
