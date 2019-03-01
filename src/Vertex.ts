import { IVec2, Vec2 } from './Vec2';
import { IWorld } from './World';
import { IPoint } from './interfaces';
import { IBody } from './Body';

export interface IVertex<T extends IBody = IBody> {
  parent: T;
  position: IVec2;
  oldPosition: IVec2;
  /** If this should be "integrated" on each world frame. */
  doIntegrate: boolean;
}

export class Vertex<T extends IBody> implements IVertex<T> {
  parent: T;
  position: IVec2 = new Vec2();
  oldPosition: IVec2 = new Vec2();
  doIntegrate: boolean = true;

  constructor(parent: T, pos: IPoint) {
    this.parent = parent;
    this.position.copy(pos);
    this.oldPosition.copy(pos);
  }
}

/**
 * "Integrate" an array of vertices, moving them forward one "time step".
 * @param vertices Vertices to "integrate"
 * @param world World the vertices are part of
 */
export function integrateVertices<T extends IBody>(vertices: IVertex<T>[], world: IWorld): void {
  const length = vertices.length;
  for (let i = 0; i < length; i++) {
    const vertex = vertices[i];
    if (vertex.doIntegrate) {
      const pos = vertex.position;
      const old = vertex.oldPosition;
      const x = pos.x;
      const y = pos.y;
      const gravity = vertex.parent.gravity;

      pos.addXY(world.kViscosity * pos.x - world.kViscosity * old.x + gravity.x,
                world.kViscosity * pos.y - world.kViscosity * old.y + gravity.y);

      old.set(x, y);
      
      // Enforce world borders
      if (world.hasBorders) {
        if (pos.y < 0) { pos.y = 0; }
        else if (pos.y > world.height) {
          pos.set(pos.x - (pos.y - world.height) * (pos.x - old.x) * world.kFrictionGround,
                  world.height);
        }
        
        if      (pos.x < 0)           { pos.x = 0;           }
        else if (pos.x > world.width) { pos.x = world.width; }    
      }
    }
  }
}
