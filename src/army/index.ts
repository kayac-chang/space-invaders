import { GameObject, Renderer, Transform, Vector, Collision } from "../types";

type Army = GameObject & Transform & Renderer & Collision;
type BaseProps = {
  src: number[][];
  position: Vector;
  update: (army: Army) => void;
};
function Base({ src, position, update }: BaseProps): Army {
  return {
    renderer: {
      type: "graphics",
      src,
    },

    position,
    update() {
      update(this);
    },

    collider: {
      size: { x: src[0].length, y: src.length },
    },

    collision: {
      start(other) {
        other.destroy = true;
        this.destroy = true;
      },
    },
  };
}

type LaserProps = Omit<BaseProps, "src">;
export function Laser({ position, update }: LaserProps) {
  return Base({ src: [[1], [1], [1], [1]], position, update });
}

export function EnemyLaser({ position, update }: LaserProps) {
  return Base({
    src: [
      [0, 1, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [0, 1, 0],
    ],
    position,
    update,
  });
}
