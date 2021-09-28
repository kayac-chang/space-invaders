import { isEnemy } from "../characters/Enemy";
import { GameObject, Vector } from "../types";

type Props = {
  counts: number;
  step: Vector;
};
export function SequentialMovement({ counts, step }: Props) {
  const movement = { x: step.x, y: 0 };
  let offset = 0;

  let direction = 1;
  let index = 0;

  return (_: number, instances: GameObject[]) => {
    const enemies = instances.filter(isEnemy);

    let processed = enemies.length > 0;

    while (processed) {
      enemies
        .filter((instance) => instance.id === index)
        .forEach((instance) => {
          instance.position.x += movement.x;
          instance.position.y += movement.y;
          instance.frame += 1;

          processed = false;
        });

      index = (index + 1) % counts;
    }

    if (index === 0) {
      if (offset === 0) movement.y = 0;

      offset += direction;
    }

    if (Math.abs(offset) < 10) return;

    movement.x *= -direction;
    if (offset === 10) movement.y = step.y;

    offset = 0;
    direction *= -1;
  };
}
