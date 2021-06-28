import { GameObject, Resource } from "../types";

export default function animate<T extends GameObject>(
  interval: number,
  images: Resource[],
) {
  let duration = 0;
  let index = 0;

  return function (this: T, delta: number) {
    duration += delta;

    if (duration >= interval) {
      index += 1;

      this.renderer = images[index % images.length];

      duration = 0;
    }
  };
}
