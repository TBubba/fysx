import { EventEmitter } from './EventEmitter';
import { IBoundingBox, IWorldObject, IPoint } from './interfaces';
import { calculateBoundingBoxOfPoints } from './util';
import { Vec2, IVec2 } from './Vec2';

export interface IZone extends IBoundingBox, IWorldObject {
  /** Points outlining the zone. */
  points: IPoint[];
}

export class Zone extends EventEmitter implements IZone {
  points: IPoint[] = [];
  layers: number = 0;
  center: IVec2 = new Vec2();
  halfEx: IVec2 = new Vec2();

  updateBoundingBox(): void {
    calculateBoundingBoxOfPoints(this.points, this);
  }
}
