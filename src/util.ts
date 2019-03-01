import { Vec2 } from './Vec2';
import { IVertex } from './Vertex';
import { IBoundingBox, IAxis, IPoint, ILineIntersectionResult } from './interfaces';
import { IBody } from './Body';
import { IZone } from './Zone';

export function createBoundingBox(): IBoundingBox {
  return {
    center: new Vec2(),
    halfEx: new Vec2()
  };
}

export function createAxis(min: number = 0, max: number = 0): IAxis {
  return { min, max };
}

/**
 * Calculate the bounding box of an array of vertices. The bounding box will be exactly
 * large enough to overlap every vertex in the array.
 * @param vertices Vertices the bounding box should overlap.
 * @param boundingBox Bounding box to to update the values of. If undefined, a new bounding box will be created.
 * @returns The bounding box.
 */
export function calculateBodyBoundingBox(vertices: IVertex[], boundingBox?: IBoundingBox): IBoundingBox {
  if (!boundingBox) { boundingBox = createBoundingBox(); }

  let minX =  Number.MAX_VALUE,
      minY =  Number.MAX_VALUE,
      maxX = -Number.MAX_VALUE,
      maxY = -Number.MAX_VALUE;

  const vCount = vertices.length;
  for (let i = 0; i < vCount; i++) {
    const p = vertices[i].position;
    if (p.x > maxX) { maxX = p.x; }
    if (p.y > maxY) { maxY = p.y; }
    if (p.x < minX) { minX = p.x; }
    if (p.y < minY) { minY = p.y; }
  }

  boundingBox.center = new Vec2((minX + maxX) * 0.5, (minY + maxY) * 0.5);
  boundingBox.halfEx = new Vec2((maxX - minX) * 0.5, (maxY - minY) * 0.5);

  return boundingBox;
}

/**
 * ???
 * @param vertices ???
 * @param vector ???
 * @param axis Axis to update the values of. If undefined, a new axis will be created.
 * @returns The axis.
 */
export function projectAxis(vertices: IVertex[], vector: IPoint, axis?: IAxis): IAxis {
  if (!axis) { axis = createAxis(); }

  let dot = vertices[0].position.dot(vector);
  axis.min = axis.max = dot;

  const vCount = vertices.length;
  for (let i = 1; i < vCount; i++) {
    dot = vertices[i].position.dot(vector);
    if (dot > axis.max) { axis.max = dot; }
    if (dot < axis.min) { axis.min = dot; }
  }

  return axis;
}

/**
 * Check if a point is inside a zone.
 * @param point 
 * @param zone 
 * @returns If the body is inside the zone.
 */
export function isPointInsideZone(point: IPoint, zone: IZone): boolean {
  if (zone.vertices.array.length === 0) { return false; }

  // A point outside the shape
  const outside = new Vec2(zone.center.x - zone.halfEx.x - 1,
                           zone.center.y - zone.halfEx.y - 1);

  // Count the number of edges the line (between outside and point) collides with
  const verts = zone.vertices.array;
  let p0;
  let p1 = verts[0];
  let cols = 0;
  for (let i = verts.length - 1; i >= 0; i--) {
    p0 = verts[i];
    const col = lineIntersection(outside, point, p0.position, p1.position);
    if (col.onLine1 && col.onLine2) { cols++; }
    p1 = p0;
  }

  // If the number of edges collided with is un-even it is inside the shape
  return !(cols % 2);
}

/**
 * Check if a body is inside a zone.
 * This returns true as long as any vertex of the body is inside the zone.
 * @param body Body to check if it is inside a zone.
 * @param zone Zone to check if body is inside.
 * @returns If the body is inside the zone.
 */
export function isBodyInZone(body: IBody, zone: IZone): boolean {
  // AABB overlap test
  // (Check if their bounding boxes overlap)
  if (!(0 > Math.abs(zone.center.x - body.center.x) - (zone.halfEx.x + body.halfEx.x) &&
        0 > Math.abs(zone.center.y - body.center.y) - (zone.halfEx.y + body.halfEx.y))) {
    return false; // No AABB overlap
  }

  // Check if any of the body's vertices is inside the zone
  const verticesArray = body.vertices.array;
  for (let i = verticesArray.length - 1; i >= 0; i--) {
    const p0 = verticesArray[i].position;
    if (isPointInsideZone(p0, zone)) { return true; }
  }

  // Check if any of the body's edges collides with the edges of the zone
  // ... 2do ... 

  // No collision
  return false;
}

/**
 * Check collision between two lines.
 * @param line1Start Start point of the first line segment.
 * @param line1End End point of the first line segment.
 * @param line2Start Start point of the second line segment.
 * @param line2End End point of the second line segment.
 * @returns ???
 */
export function lineIntersection(line1Start: IPoint, line1End: IPoint, line2Start: IPoint, line2End: IPoint): ILineIntersectionResult {
  const result: ILineIntersectionResult = {
    x: 0,
    y: 0,
    onLine1: false,
    onLine2: false,
  };

  // if the lines intersect, the result contains the x and y of the intersection (treating the lines as infinite) and booleans for whether
  // line segment 1 or line segment 2 contain the point
  const denominator = ((line2End.y - line2Start.y) * (line1End.x - line1Start.x)) - ((line2End.x - line2Start.x) * (line1End.y - line1Start.y));
  if (denominator === 0) { return result; }
  let a = line1Start.y - line2Start.y;
  let b = line1Start.x - line2Start.x;
  const numerator1 = ((line2End.x - line2Start.x) * a) - ((line2End.y - line2Start.y) * b);
  const numerator2 = ((line1End.x - line1Start.x) * a) - ((line1End.y - line1Start.y) * b);
  a = numerator1 / denominator;
  b = numerator2 / denominator;

  // if we cast these lines infinitely in both directions, they intersect here:
  result.x = line1Start.x + (a * (line1End.x - line1Start.x));
  result.y = line1Start.y + (a * (line1End.y - line1Start.y));
  /*
    // it is worth noting that this should be the same as:
    x = line2Start.x + (b * (line2End.x - line2Start.x));
    y = line2Start.x + (b * (line2End.y - line2Start.y));
  */

  // if line1 is a segment and line2 is infinite, they intersect if:
  if (a > 0 && a < 1) { result.onLine1 = true; }
  // if line2 is a segment and line1 is infinite, they intersect if:
  if (b > 0 && b < 1) { result.onLine2 = true; }
  // if line1 and line2 are segments, they intersect if both of the above are true
  
  return result;
}
