import { isEnemy } from "../characters/Enemy";
import { GameObject } from "../types";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function throttle(ms: number, fn: Function) {
  let duration = ms;

  return function (delta: number, ...args: any[]) {
    duration -= delta;

    if (duration > 0) return;

    fn(delta, ...args);
    duration = ms;
  };
}

type Props = {
  row: number;
  rate: number;
};
export function RandomlyShoot({ row, rate }: Props) {
  return throttle(rate, (_: number, instances: GameObject[]) => {
    const x = getRandomInt(0, row);

    const instance = instances
      .filter(isEnemy)
      .filter(({ id }) => (id % row) - x === 0)
      .sort((a, b) => b.position.y - a.position.y)[0];

    if (instance) instance.canShoot = true;
  });
}
