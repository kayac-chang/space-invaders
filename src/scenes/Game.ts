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
import { RandomlyShoot } from "../logic/RandomlyShoot";
import GameHUD from "../HUD/Game";

const GRID_SIZE = 16;
const ROW_WIDTH = 11;

const INIT_POSITION = {
  x: 16,
  y: 50,
};

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
    position: {
      x: INIT_POSITION.x + x * GRID_SIZE,
      y: INIT_POSITION.y + y * GRID_SIZE,
    },
  }))
);

function spawn(generate: typeof Enemy, points: EnemyProps[][]) {
  return points.map((row) => row.map(generate)).flat();
}

const ap = (...fns: Function[]) => (...args: any[]) =>
  fns.reduce((res, fn) => res.concat(fn(...args)), [] as any[]);

export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [
    LaserCannon(screen),
    ...spawn(Enemy, points),
    ...GameHUD(),
  ];

  const update = ap(
    SequentialMovement({
      counts: instances.filter(isEnemy).length,
      step: 2,
    }),
    RandomlyShoot({
      row: ROW_WIDTH,
      rate: 1000,
    })
  );

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

      update(delta, instances);

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
