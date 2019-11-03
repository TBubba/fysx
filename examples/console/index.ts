import * as FYSX from '../../src';

// Create a physics world
const world = new FYSX.World();

// Create some bodies
const body1 = FYSX.createRectangleBody(new FYSX.Vec2(75, 100), new FYSX.Vec2(50, 50));
body1.acceleration.set(0, 4);
world.addBody(body1);

const body2 = FYSX.createRectangleBody(new FYSX.Vec2(100, 100 + 100), new FYSX.Vec2(50, 50));
body2.acceleration.set(0, 0.5);
world.addBody(body2);

// Simulate
for (let i = 0; i < 1000; i++) {
  world.frame();
  console.log(
      '| 1:', body1.center.clone().round(),
    '\t| 2:', body2.center.clone().round()
  );
}
