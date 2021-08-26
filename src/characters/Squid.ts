import { Collision, GameObject, Renderer, Shooter, Transform } from "../types";
import { EnemyLaser } from "../army";

const image1 = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 1, 0, 0, 1, 0, 1],
];

const image2 = [
  [0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 1, 1, 1, 0],
  [1, 1, 0, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 1, 0, 1, 1, 0, 1, 0],
  [1, 0, 0, 0, 0, 0, 0, 1],
  [0, 1, 0, 0, 0, 0, 1, 0],
];

type Enemy = GameObject & Transform & Renderer & Collision & Shooter;
export default function Squid(): Enemy {
  const images = [image1, image2];

  let current = 0;
  let timePass = 0;

  return {
    position: { x: 0, y: 0 },

    update(delta) {
      timePass += delta;

      if (timePass > 1000) {
        current += 1;
        timePass = 0;

        this.renderer.src = images[current % images.length];
        this.canShoot = true;
      }
    },

    canShoot: false,
    shoot() {
      const { x, y } = this.position;
      const [w, h] = [image1[0].length, image1.length];

      return EnemyLaser({
        position: { x: x + w / 2, y: y + h + 1 },
        update(it) {
          it.position.y += 1;
        },
      });
    },

    renderer: {
      type: "graphics",
      src: images[current % images.length],
    },

    collider: {
      size: { x: image1[0].length, y: image1.length },
    },
  };
}
