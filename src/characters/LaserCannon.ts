import { Graphics } from "pixi.js";
import { Control, GameObject, Key, Transfrom } from "../types";

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

function clamp(min: number, max: number, value: number) {
  return Math.max(Math.min(max, value), min);
}

type Props = Transfrom;

export default function LaserCannon(
  { position }: Props,
): GameObject & Transfrom & Control {
  return {
    position,

    handleInput(pressed) {
      if (pressed.includes(Key.Left)) {
        this.position.x -= 1;
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x += 1;
        return;
      }
    },

    render(app) {
      const graphics = new Graphics();

      for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
          if (image[y][x] === 0) continue;

          graphics.beginFill(0xffffff);

          graphics.drawRect(x, y, 1, 1);

          graphics.endFill();
        }
      }

      app.stage.addChild(graphics);

      this.position.x = clamp(
        0,
        app.screen.width - graphics.width,
        this.position.x,
      );

      graphics.position.set(this.position.x, this.position.y);
    },
  };
}
