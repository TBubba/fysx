import { IBody } from './Body';
import { IVertex } from './Vertex';

/** Collidable edge of a body between two vertices. */
export interface IEdge<T = any> {
  /** Body this belongs to. */
  parent: IBody<T>;
  /** First vertex of the edge. */
  v0: IVertex<T>;
  /** Second vertex of the edge. */
  v1: IVertex<T>;
}

export class Edge<T = any> implements IEdge<T> {
  parent: IBody<T>;
  v0: IVertex<T>;
  v1: IVertex<T>;

  constructor(parent: IBody<T>, v0: IVertex<T>, v1: IVertex<T>) {
    this.parent = parent;
    this.v0 = v0;
    this.v1 = v1;
  }
}
