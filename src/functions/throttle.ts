import { GameObject } from "../types";

export function throttle(fn: (delta: number) => void, ms: number) {
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
