# Day15

在 `Space Invaders` 的遊戲設計中，
除了隨著不斷前進而產生的壓迫感之外，
`Enemy` 的射擊也扮演了相輔相成的作用。

他讓遊戲內容不只是單純的玩家射擊，
玩家也需要小心來自敵方的攻擊，
而且隨著時間的推移，敵人與玩家的距離縮短，難度跟刺激感會越來越強烈，
這是這款遊戲最精妙的設計。

接下來，卡比要實作原作遊戲中，`Enemy` 的射擊邏輯。

## Random

首先我們需要新增一個新的檔案，`src/logic/RandomlyShoot.ts`。

然後，我們撰寫一個隨機函式，幫助我們挑選由 **哪一排** 進行射擊。

```ts
function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}
```

## Throttle

根據原作遊戲，大概每隔一秒會進行射擊。

我們透過每次刷新畫面時的時間差，計算經過的秒數，
當秒數超過指定時間後，才去執行函式，
這個概念叫做 `throttle`。

```ts
function throttle(ms: number, fn: Function) {
  let duration = ms;

  return function (delta: number, ...args: any[]) {
    duration -= delta;

    if (duration > 0) return;

    fn(delta, ...args);
    duration = ms;
  };
}
```

## Randomly Shoot

接著就是，主要的高階函式，
第一個參數 `delta`，也就是每禎畫面的時間差，
第二個參數就是畫面上的 `instances`。

透過 `Enemy` 的 `id` 我們很快就可以過濾出哪一排，
並挑出最接近玩家的 `Enemy` 即可。

-- `src/logic/RandomlyShoot.ts`

```ts
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
      .reduce((a, b) => (a.position.y > b.position.y ? a : b));

    instance.canShoot = true;
  });
}
```

因為我們調整了參數，所以我們要修正一下 `SequentialMovement`，
這邊會在後面章節再進行調整，方便我們每次改動時更有彈性。

```diff
export function SequentialMovement({ counts, step }: Props) {
  const movement = { x: step, y: 0 };
  let pedometer = 0;
  let index = 0;

+ return (_: number, instances: GameObject[]) => {
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
      if (pedometer === 0) movement.y = 0;

      pedometer += 1;
    }

    if (pedometer <= 10) return;

    movement.x *= -1;
    movement.y = step;

    pedometer = 0;
  };
}
```

## Functional Programming - ap

接下來我們要寫一個方便的工具，
`ap`，他可以把傳入的函式組合成一個，
我們只需要執行那個組合後的函式就可以了。

```ts
const ap = (...fns: Function[]) => (...args: any[]) =>
  fns.reduce((res, fn) => res.concat(fn(...args)), [] as any[]);
```

```diff
+ import { RandomlyShoot } from "../logic/RandomlyShoot";

+ const ap = (...fns: Function[]) => (...args: any[]) =>
+   fns.reduce((res, fn) => res.concat(fn(...args)), [] as any[]);

export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [LaserCannon(screen), ...spawn(Enemy, points)];

+ const update = ap(
+   SequentialMovement({
+     counts: instances.filter(isEnemy).length,
+     step: 2,
+   }),
+   RandomlyShoot({
+     row: ROW_WIDTH,
+     rate: 1000,
+   })
+ );

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

+     update(delta, instances);

      instances.forEach((instance) => {
        if (canControl(instance)) {
          instance.handleInput(getKeyPressed());
        }

        if (canShoot(instance) && instance.canShoot) {
          requestAnimationFrame(() => {
            instances = [...instances, instance.shoot()];
          });

          instance.canShoot = false;
        }

        if (instance.destroy) {
          requestAnimationFrame(() => {
            instances = instances.filter((_instance) => _instance !== instance);
          });

          return;
        }

        instance.update?.(delta);
      });
    },

    render(stage) {
      clear();

      instances
        .filter(canRender)
        .forEach((instance) => render(stage, instance));
    },
  };
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
