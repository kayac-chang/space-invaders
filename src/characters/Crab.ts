import { Graphics } from "pixi.js";
import { GameObject, Transfrom } from "../types";

const image = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
];

const image2 = [
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

export default function Crab(): GameObject & Transfrom {
  let current = 0;
  const images = [image, image2];

  let timePass = 0;

  return {
    position: { x: 0, y: 0 },

    update(delta) {
      timePass += delta;

      if (timePass > 1000) {
        current += 1;
        timePass = 0;
      }
    },

    render(app) {
      const graphics = new Graphics();

      const image = images[current % images.length];

      for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
          if (image[y][x] === 0) continue;

          graphics.beginFill(0xffffff);

          graphics.drawRect(x, y, 1, 1);

          graphics.endFill();
        }
      }

      app.stage.addChild(graphics);
    },
  };
}
