import { isEnemy } from "../characters/Enemy";
import { GameObject } from "../types";

type Props = {
  counts: number;
  step: number;
};
export function SequentialMovement({ counts, step }: Props) {
  const movement = { x: step, y: 0 };
  let pedometer = 0;
  let index = 0;

  return (instances: GameObject[]) => {
    instances
      .filter(isEnemy)
      .filter((instance) => instance.id === index)
      .forEach((instance) => {
        instance.position.x += movement.x;
        instance.position.y += movement.y;
        instance.current += 1;
      });

    index = (index + 1) % counts;

    if (index === 0) {
      if (pedometer === 0) movement.y = 0;

      pedometer += 1;
    }

    if (pedometer !== 10) return;

    movement.x *= -1;
    movement.y = step;

    pedometer = 0;
  };
}
