import { IDict, IPoint } from './interfaces';
import { Body, IBody } from './Body';
import { Vertex } from './Vertex';
import { DistanceConstraint } from './constraints';
import { Edge } from './Edge';

/** ([v0 key, v1 key]) */
export type ICreateBodyOptsConstraint = [string, string];

/** ([v0 key, v1 key]) */
export type ICreateBodyOptsEdge = [string, string];

export interface ICreateBodyOpts {
  /** Mass of the Body. */
  mass?: number;
  /** Layers the body will be on. */
  layers?: number;
  /** Vertices to add to the body (their keys and initial positions). */
  vertices?: IDict<IPoint>;
  /** Constraints to add to the body. */
  constraints?: ICreateBodyOptsConstraint[];
  /** Edges to add to the body. */
  edges?: ICreateBodyOptsEdge[];
}

export function createBody(opts: ICreateBodyOpts): Body {
  const body = new Body();
  applyBody(body, opts);
  return body;
}

export function applyBody<T extends IBody>(body: T, opts: ICreateBodyOpts): void {
  if (opts.mass   !== undefined) { body.mass   = opts.mass;   }
  if (opts.layers !== undefined) { body.layers = opts.layers; }

  for (let n in opts.vertices) {
    body.vertices.set(n, new Vertex(body, opts.vertices[n]));
  }
  
  if (opts.constraints) {
    for (let i = 0; i < opts.constraints.length; i++) {
      const constraintOpts = opts.constraints[i];
      const v0 = body.vertices.dict[constraintOpts[0]];
      const v1 = body.vertices.dict[constraintOpts[1]];
      if (!v0) { throw new Error(`The v0 key in constraint options is not in use (key: "${constraintOpts[0]}", index: ${i}).`); }
      if (!v1) { throw new Error(`The v1 key in constraint options is not in use (key: "${constraintOpts[1]}", index: ${i}).`); }
      const constraint = new DistanceConstraint(body, v0, v1);
      constraint.setSquaredDistance(v0.position.squareDistanceTo(v1.position));
      body.constraints.push(constraint);
    }    
  }
  
  if (opts.edges) {
    for (let i = 0; i < opts.edges.length; i++) {
      const edgeOpts = opts.edges[i];
      const v0 = body.vertices.dict[edgeOpts[0]];
      const v1 = body.vertices.dict[edgeOpts[1]];
      if (!v0) { throw new Error(`The v0 key in edge options (with index ${i}) is not in use.`); }
      if (!v1) { throw new Error(`The v1 key in edge options (with index ${i}) is not in use.`); }
      const edge = new Edge(body, v0, v1);
      body.edges.push(edge);
    }    
  }
}

export function createRectangleBody(pos: IPoint, size: IPoint): Body {
  return createBody({
    vertices: {
      'a': { x: pos.x,          y: pos.y          },
      'b': { x: pos.x + size.x, y: pos.y          },
      'c': { x: pos.x + size.x, y: pos.y + size.y },
      'd': { x: pos.x,          y: pos.y + size.y }
    },
    constraints: [
      // Border
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
      ['d', 'a'],
      // Cross
      ['a', 'c'],
      ['b', 'd'],
    ],
    edges: [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
      ['d', 'a'],
    ],
  });
}
