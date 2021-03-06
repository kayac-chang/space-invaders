import { clamp } from "../functions/utils";
import {
  Control,
  GameObject,
  Key,
  Renderer,
  Shooter,
  Transform,
} from "../types";
import { Laser } from "../army";

type TLaserCannon = GameObject & Transform & Control & Renderer & Shooter;

export default function LaserCannon(screen: {
  width: number;
  height: number;
}): TLaserCannon {
  let timePass = 0;

  return {
    renderer: {
      type: "graphics",
      src: [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    },

    position: { x: 10, y: screen.height - 20 },

    canShoot: false,
    shoot() {
      const { x, y } = this.position;

      return Laser({
        position: { x: x + 5, y: y - 4 },
        update(it) {
          it.position.y -= 1;
        },
      });
    },

    handleInput(this: TLaserCannon, pressed) {
      if (pressed.includes(Key.Space) && timePass > 500) {
        this.canShoot = true;
        timePass = 0;
      }

      const width = screen.width - this.renderer.src[0].length;

      if (pressed.includes(Key.Left)) {
        this.position.x = clamp(0, width, this.position.x - 1);
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x = clamp(0, width, this.position.x + 1);
        return;
      }
    },

    update(delta) {
      timePass += delta;
    },
  };
}
