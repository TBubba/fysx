import { IDict, IMesh, IPoint } from './interfaces';
import { Body } from './Body';
import { Vertex } from './Vertex';
import { DistanceConstraint } from './constraints';

/** ([v0 key, v1 key, edge]) */
export type ICreateBodyOptsConstraint = [string, string, boolean];

export interface ICreateBodyOptsMesh {
  /** Keys of the vertices the mesh consists of. The order is preserved. */
  vertices: string[];
  /** Texture or something??? */
  texture: any;
  /** Indices of the body. */
  indices: number[];
  /** UVs of the body. */
  uvs: number[];
}

export interface ICreateBodyOpts {
  /** Mass of the Body. */
  mass?: number;
  /** Layers the body will be on. */
  layers?: number;
  /** Vertices to add to the body (their keys and initial positions). */
  vertices?: IDict<IPoint>;
  /** Constraints to add to the body. */
  constraints?: ICreateBodyOptsConstraint[];
  /** Meshes to add to the body. */
  meshes?: ICreateBodyOptsMesh[];
}

export function createBody(opts: ICreateBodyOpts): Body {
  const body = new Body();

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
      if (!v0) { throw new Error(`The v0 key in constraint options (with index ${i}) is not in use.`); }
      if (!v1) { throw new Error(`The v1 key in constraint options (with index ${i}) is not in use.`); }
      const constraint = new DistanceConstraint(body, v0, v1, !!constraintOpts[2]);
      constraint.setSquaredDistance(v0.position.squareDistanceTo(v1.position));
      if (constraint.edge) { body.edges.push(constraint); }
      body.constraints.push(constraint);
    }    
  }
  
  if (opts.meshes) {
    for (let key in opts.meshes) {
      const bmk = opts.meshes[key];
      const mesh: IMesh = {
        parent:   body,
        name:     key,
        texture:  bmk.texture,
        vertices: [],
        indices:  bmk.indices.slice(),
        uvs:      bmk.uvs.slice()
      };
      for (let i = bmk.vertices.length - 1; i >= 0; i--) {
        const vertexKey = bmk.vertices[i];
        const vertex = body.vertices.dict[vertexKey];
        if (!vertex) { throw new Error(`The vertex key in mesh options is not in use (mesh key: "${key}", vertex key: "${vertexKey}").`); }
        mesh.vertices[i] = vertex;
      }
      body.meshes.push(mesh);
    }
  }
  
  return body;
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
      ['a', 'b', true],
      ['b', 'c', true],
      ['c', 'd', true],
      ['d', 'a', true],
      // Cross
      ['a', 'c', false],
      ['b', 'd', false],
    ],
  });
}
