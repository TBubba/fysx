import * as FYSX from '../../src/index';
import * as PIXI from 'pixi.js';
import { DistanceConstraint, LeashConstraint, PinConstraint, AngleConstraint } from '../../src/index';

document.addEventListener('DOMContentLoaded', init);

function init() {
  // Create PIXI app
  const app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor : 0x1099bb
  });
  document.body.appendChild(app.view);

  // Create FYSX world
  const world = new FYSX.World();
  world.hasBorders = true;
  world.width = app.renderer.width;
  world.height = app.renderer.height;
  world.kNumIterations = 8;
  
  // Create a bunch of boxes
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      const body = FYSX.createRectangleBody(
        new FYSX.Vec2(
          60 * (x + 1),
          60 * (y + 1)
        ),
        new FYSX.Vec2(50, 50)
      );
      body.acceleration.set(0, 0.2);
      world.addBody(body);
    }
  }

  // Create graphics
  const g = new PIXI.Graphics();
  app.stage.addChild(g);

  // Listen for animate updates
  app.ticker.add(function(delta) {
    // Update physics world
    world.frame();
    // Render all bodies
    g.clear();
    g.lineStyle(1, 0xffc2c2);
    for (let body of world.bodies) {
      // Render vertices
      for (let i = 0; i < body.vertices.array.length; i++) {
        const vertex = body.vertices.array[i];
        g.drawCircle(vertex.position.x, vertex.position.y, 2);
      }
      // Render constraints
      for (let i = 0; i < body.constraints.length; i++) {
        const constraint = body.constraints[i];
        if (constraint instanceof DistanceConstraint ||
            constraint instanceof LeashConstraint) {
          const pos0 = constraint.v0.position;
          const pos1 = constraint.v1.position;
          g.moveTo(pos0.x, pos0.y);
          g.lineTo(pos1.x, pos1.y);
        } else if (constraint instanceof PinConstraint) {
          const pos0 = constraint.v0.position;
          const pos1 = constraint.p1;
          g.moveTo(pos0.x, pos0.y);
          g.lineTo(pos1.x, pos1.y);
        } else if (constraint instanceof AngleConstraint) {
          const pos0 = constraint.v0.position;
          const pos1 = constraint.v1.position;
          const pos2 = constraint.v2.position;
          g.moveTo(pos1.x, pos1.y);
          g.lineTo(pos0.x, pos0.y);
          g.lineTo(pos2.x, pos2.y);
          // @TODO Render some arch between the two lines?
        }
      }
    }
  });
}
