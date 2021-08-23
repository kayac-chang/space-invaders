import { Container, Rectangle } from "pixi.js";
import LaserCannon from "../characters/LaserCannon";
import Squid from "../characters/Squid";
import { getKeyPressed } from "../systems/input";
import { render } from "../systems/render";
import { canControl, canRender, canShoot, GameObject, Scene } from "../types";

export default function Game(screen: Rectangle): Scene<Container> {
  const instances: GameObject[] = [LaserCannon(screen), Squid()];

  return {
    update(delta) {
      instances.forEach((instance) => {
        if (canControl(instance)) {
          instance.handleInput(getKeyPressed());
        }

        if (canShoot(instance) && instance.canShoot) {
          requestAnimationFrame(() => {
            instances.push(instance.shoot());
          });

          instance.canShoot = false;
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
