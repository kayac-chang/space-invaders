import { Container, Rectangle } from "pixi.js";
import LaserCannon from "../characters/LaserCannon";
import Squid from "../characters/Squid";
import { getKeyPressed } from "../systems/input";
import { render } from "../systems/render";
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

export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [LaserCannon(screen), Squid()];

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

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
      instances
        .filter(canRender)
        .forEach((instance) => render(stage, instance));
    },
  };
}
