# Day18

接下來再進到分數系統之前，
卡比要先進行位置的校正，使我們更接近原作。

## Enemy

首先我們需要校正 `Enemy` 的位置，
我們將每個整個 `Enemy` 區塊切成 `5 * 11` 的格子，
而一個格子的長寬為 `16`。

但因為我們的對齊方式是對齊格子的左上，
所以我們要一些調整，讓 `Enemy` 置中對齊。

-- `src/characters/Enemy.ts`

```diff
export type EnemyProps = {
  type: EnemyTypes;
  position: Vector;
  id: number;
+ grid: number;
};
export default function Enemy({
  type,
  id,
  position,
+ grid,
}: EnemyProps): IEnemy {
  const images = EnemyImages[type];

  let current = 0;

+ const height = images[current].length;
+ const width = images[current][0].length;

  return {
    id,
    tags: ["enemy"],
+   position: {
+     ...position,
+     x: position.x + grid / 2 - width / 2,
+   },

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
+     const [w, h] = [width, height];

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
+     size: { x: width, y: height },
    },
  };
}
```

## Game

接下來我們要調整整個 `Enemy` 的區塊在畫面上的位置，
我們希望整個區塊能對其畫面的正中間，
所以我們需要 `screen` 的 長寬資訊。

移動 `INIT_POSITION` 跟 `points` 到函式內以取得 `screen`。

並且，我們要接著調整 `Enemy` 的移動距離，
透過改動 `SequentialMovement` 的 `step`。

矯正如下

-- `src/scenes/Game.ts`

```diff
export default function Game(screen: Rectangle): Scene<Container> {
+ const INIT_POSITION = {
+   x: screen.width / 2 - (GRID_SIZE * ROW_WIDTH) / 2,
+   y: 50,
+ };

+ const points: EnemyProps[][] = [
+   "squid",
+   "crab",
+   "crab",
+   "octopus",
+   "octopus",
+ ].map((type, y, list) =>
+   Array.from({ length: ROW_WIDTH }, (_, x) => ({
+     id: (list.length - 1 - y) * ROW_WIDTH + x,
+     type: type as EnemyTypes,
+     position: {
+       x: INIT_POSITION.x + x * GRID_SIZE,
+       y: INIT_POSITION.y + y * GRID_SIZE,
+     },
+     grid: GRID_SIZE,
+   }))
+ );

  let instances: GameObject[] = [
    LaserCannon(screen),
    ...spawn(Enemy, points),
    ...GameHUD(),
  ];

  const update = ap(
    SequentialMovement({
      counts: instances.filter(isEnemy).length,
+     step: { x: 2, y: GRID_SIZE / 2 },
    }),
    RandomlyShoot({
      row: ROW_WIDTH,
      rate: 1000,
    })
  );

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

      update(delta, instances);

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

## SequentialMovement

除了改動移動的距離之外，
我們也需要調整移動的方式，讓 `Enemy` 能限制在畫面中間移動。

```diff
type Props = {
  counts: number;
+ step: Vector;
};
export function SequentialMovement({ counts, step }: Props) {
+ const movement = { x: step.x, y: 0 };
+ let offset = 0;

+ let direction = 1;
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
+     if (offset === 0) movement.y = 0;

+     offset += direction;
    }

+   if (Math.abs(offset) < 10) return;

+   movement.x *= -direction;
+   if (offset === 10) movement.y = step.y;

+   offset = 0;
+   direction *= -1;
  };
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
