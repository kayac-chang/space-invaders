import LaserCannon from "../characters/LaserCannon";
import { GameObject, Scene } from "../types";

export default function Game(): Scene {
  const instances: GameObject[] = [
    LaserCannon({
      position: { x: 10, y: 20 },
    }),
  ];

  return {
    update(delta) {
      instances.forEach((instance) => instance.update?.(delta));
    },
    render(app) {
      instances.forEach((instance) => instance.render(app));
    },
  };
}
