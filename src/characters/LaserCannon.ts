import { getKeyDown, Key } from "../Control";
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

function throttle(fn: (delta: number) => void, ms: number) {
  let duration = 0;

  return function (this: GameObject, delta: number) {
    duration += delta;

    if (duration < ms) {
      return;
    }

    fn.call(this, delta);

    duration = 0;
  };
}

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
