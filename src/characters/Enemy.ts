import {
  Collision,
  GameObject,
  Renderer,
  Shooter,
  Transform,
  Vector,
} from "../types";
import { EnemyLaser } from "../army";

export type EnemyTypes = "squid" | "crab" | "octopus";

const EnemyImages: { [key in EnemyTypes]: number[][][] } = {
  squid: [
    [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 1, 0, 0],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 0, 1, 0, 0, 1, 0, 1],
    ],
    [
      [0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 0, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 1, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 0],
    ],
  ],

  octopus: [
    [
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    ],
    [
      [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    ],
  ],

  crab: [
    [
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
      [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
      [0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0],
    ],
    [
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1],
      [1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
      [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0],
    ],
  ],
};

export type IEnemy = GameObject &
  Transform &
  Renderer &
  Collision &
  Shooter & { id: number; current: number };

export function isEnemy(instance: any): instance is IEnemy {
  return Boolean(instance.tags?.includes("enemy"));
}

export type EnemyProps = {
  type: EnemyTypes;
  position: Vector;
  id: number;
};
export default function Enemy({ type, id, position }: EnemyProps): IEnemy {
  const images = EnemyImages[type];

  let current = 0;

  return {
    id,
    tags: ["enemy"],
    position,

    set current(value) {
      current = value % images.length;

      this.renderer.src = images[current];
    },
    get current() {
      return current;
    },

    canShoot: false,
    shoot() {
      const { x, y } = this.position;
      const [w, h] = [images[0].length, images.length];

      return EnemyLaser({
        position: { x: x + w / 2, y: y + h + 1 },
        update(it) {
          it.position.y += 1;
        },
      });
    },

    renderer: {
      type: "graphics",
      src: images[current],
    },

    collider: {
      size: { x: images[0].length, y: images.length },
    },
  };
}
