import { IVertex } from './Vertex';
import { Vec2, IVec2 } from './Vec2';
import { EventEmitter } from './EventEmitter';
import { IBoundingBox, ICollidable } from './interfaces';
import { calculateBodyBoundingBox } from './util';
import { PerfDict } from './PerfDict';

export interface IZone<T = any> extends IBoundingBox, ICollidable<T> {
}

export class Zone<T = any> extends EventEmitter implements IZone<T> {
  vertices: PerfDict<IVertex<T>> = new PerfDict();
  center: Vec2 = new Vec2();
  halfEx: Vec2 = new Vec2();
  mass: number = 0;
  isImmovable: boolean = true;
  layers: number = 0;
  gravity: IVec2 = new Vec2();
  data: T | undefined = undefined;

  updateBoundingBox(): void {
    calculateBodyBoundingBox(this.vertices.array, this);
  }
}
