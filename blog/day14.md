# Day14

在 `Space Invaders` 的遊戲設計中，
`Enemy` 的移動邏輯扮演了非常重要的角色，
他為遊戲提供了難度，並隨著玩家每次擊殺 `Enemy` 增加難度，
是這款遊戲最關鍵的遊戲設計。

接下來，卡比要實作原作遊戲中，`Enemy` 的移動邏輯。

## Tags

首先，為了讓遊戲邏輯能夠操作特定的遊戲物件，
我們需要新增一個概念，`tags`。

透過 `tags`，
我們可以知道當前的遊戲物件是什麼，
並對其提供相對應的操作。

-- `src/types.ts`

```ts
export interface GameObject {
  tags?: string[];
  destroy?: boolean;
  update?(delta: number): void;
}
```

## Enemy

為了要將遊戲邏輯集中在一處，
我們需要將 `Enemy` 的邏輯做些調整。

透過分析原作，卡比發現，
`Enemy` 會在每次移動時才會切換圖片，
於是我們要設計一個 `Proxy`，外面的邏輯可以透過操作 `Proxy` 來操作圖片。

並且需要一個 `id`，
這個在我們邏輯操作時方便我們知道當前物件的位置以及確定個數。

```ts
export type IEnemy = GameObject &
  Transform &
  Renderer &
  Collision &
  Shooter & { id: number; frame: number };

export default function Enemy({ type, id, position }: EnemyProps): IEnemy {
  const images = EnemyImages[type];

  let current = 0;

  return {
    id,
    tags: ["enemy"],
    position,

    set frame(value) {
      current = value % images.length;

      this.renderer.src = images[current];
    },
    get frame() {
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
```

## Game

根據原作，`Enemy` 原先的位置決定了其移動的順序，
為了復刻原作 **按照順序一個接一個的移動**，
要透過 `id` 來對應 `Enemy` 原先的位置。

對照表示意如下：

```
[
  [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54],
  [33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43],
  [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  [11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21],
  [ 0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10],
]
```

實作如下：

-- `src/scenes/Game.ts`

```ts
const GRID_SIZE = 16;
const ROW_WIDTH = 11;

const points: EnemyProps[][] = [
  "squid",
  "crab",
  "crab",
  "octopus",
  "octopus",
].map((type, y, list) =>
  Array.from({ length: ROW_WIDTH }, (_, x) => ({
    id: (list.length - 1 - y) * ROW_WIDTH + x,
    type: type as EnemyTypes,
    position: { x: x * GRID_SIZE, y: y * GRID_SIZE },
  }))
);
```

## GameLogic

為了集中管理遊戲邏輯，我們要開一個新的資料夾。
在 `src` 底下建立一個新的資料夾 `logic` 並建立一個檔案 `SequentialMovement.ts`。

`SequentialMovement` 是一個 `higherOrderFunction`，
他會回傳一個 `update` 函式，用於每次刷新時執行。

`SequentialMovement` 會負責提供 `Enemy` 在遊戲中的移動行為 ，細節如下：

- 每次畫面刷新只移動一個 `Enemy` 並橫向移動。
- 每移動十步會:
  - 開始反向移動。
  - 往下移動一次。

實作如下：

-- `src/logic/SequentialMovement.ts`

```ts
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

## Apply

接著我們只要在 `Game` 套上邏輯即可。

-- `src/scenes/Game.ts`

```ts
export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [LaserCannon(screen), ...spawn(Enemy, points)];

  const update = SequentialMovement({
    counts: instances.filter(isEnemy).length,
    step: 2,
  });

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

      update(instances);

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
