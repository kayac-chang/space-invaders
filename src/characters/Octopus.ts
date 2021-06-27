import { GameObject, Resource } from "../types";

const image1 = [
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
  [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
];

const image2 = [
  [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
  [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
];

function animate<T extends GameObject>(images: Resource[]) {
  let duration = 0;
  let index = 0;

  return function (this: T, delta: number) {
    duration += delta;

    if (duration >= 2000) {
      index += 1;

      this.renderer = images[index % images.length];

      duration = 0;
    }
  };
}

export default function Octopus(): GameObject {
  return {
    position: { x: 0, y: 0 },
    renderer: image2,
    update: animate([image1, image2]),
  };
}
