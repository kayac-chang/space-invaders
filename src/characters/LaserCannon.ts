import { getKeyDown, Key } from "../Control";
import { throttle } from "../functions/throttle";
import { GameObject } from "../types";

const image = [
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export default function LaserCannon(): GameObject {
  return {
    position: { x: 0, y: 0 },
    renderer: image,
    update: throttle(function (this: GameObject) {
      const keydown = getKeyDown();

      if (keydown === Key.ArrowLeft) {
        this.position.x -= 1;
        return;
      }

      if (keydown === Key.ArrowRight) {
        this.position.x += 1;
        return;
      }
    }, 300),
  };
}
