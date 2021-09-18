import { Container, Rectangle } from "pixi.js";
import LaserCannon from "../characters/LaserCannon";
import Enemy, { EnemyTypes, EnemyProps, isEnemy } from "../characters/Enemy";
import { getKeyPressed } from "../systems/input";
import { clear, render } from "../systems/render";
import { collisionDetect } from "../systems/collision";
import {
  canCollision,
  canControl,
  canRender,
  canShoot,
  canTransform,
  GameObject,
  Scene,
} from "../types";

import { SequentialMovement } from "../logic/SequentialMovement";

const GRID_SIZE = 16;
const ROW_WIDTH = 11;

const points: EnemyProps[][] = [
  "squid",
  "crab",
  "crab",
  "octopus",
  "octopus",
].map((type, y, list) =>
  Array.from({ length: ROW_WIDTH }, (_, x) => ({
    id: (list.length - 1 - y) * ROW_WIDTH + x,
    type: type as EnemyTypes,
    position: { x: x * GRID_SIZE, y: y * GRID_SIZE },
  }))
);

function spawn(generate: typeof Enemy, points: EnemyProps[][]) {
  return points.map((row) => row.map(generate)).flat();
}

export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [LaserCannon(screen), ...spawn(Enemy, points)];

  const update = SequentialMovement({
    counts: instances.filter(isEnemy).length,
    step: 2,
  });

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

      update(instances);

      instances.forEach((instance) => {
        if (canControl(instance)) {
          instance.handleInput(getKeyPressed());
        }

        if (canShoot(instance) && instance.canShoot) {
          requestAnimationFrame(() => {
            instances = [...instances, instance.shoot()];
          });

          instance.canShoot = false;
        }

        if (instance.destroy) {
          requestAnimationFrame(() => {
            instances = instances.filter((_instance) => _instance !== instance);
          });

          return;
        }

        instance.update?.(delta);
      });
    },

    render(stage) {
      clear();

      instances
        .filter(canRender)
        .forEach((instance) => render(stage, instance));
    },
  };
}
