# Day12

## Level Design

接下來我們要開始設計關卡，
小蜜蜂的關卡很單純，但是背後的心理卻很深奧。

不過卡比目前只需要完成基本的就行了，
也就是將 `Enemy` 的陣型排列出來。

## Screen

首先我們要先調整一下畫面的大小，
這邊按照原作的大小比例下去調整。

-- `src/main.ts`

```diff
const app = new Application({
+ width: 224,
+ height: 256,
+ resolution: 3,
});
```

## Refactor

接著我們調整一下 `Enemy`，
我們需要這邊的 `types` 方便我們在其他腳本中使用。

-- `src/characters/Enemy.ts`

```ts
export type EnemyTypes = "squid" | "crab" | "octopus";
```

```ts
export type EnemyProps = {
  type: EnemyTypes;
  position: Vector;
};
```

## Spawn

接著根據原作，敵人的陣型會有 5 排，並且會以下的方式排列。

![](https://www.technologyuk.net/computing/computer-gaming/gaming-landmarks-1960-1985/images/gaming_landmarks_1009.gif)

所以我們需要生成一個矩陣，
並透過這個矩陣產生相對應的 `Enemy` 以及提供其初始位置。

-- `src/scenes/Game.ts`

```ts
const grid = 16;

const points: EnemyProps[][] = [
  "squid",
  "crab",
  "crab",
  "octopus",
  "octopus",
].map((type, y) =>
  Array.from({ length: 11 }, (_, x) => ({
    type: type as EnemyTypes,
    position: { x: x * grid, y: y * grid },
  }))
);

function spawn(generate: typeof Enemy, points: EnemyProps[][]) {
  return points.map((row) => row.map(generate)).flat();
}
```

```diff
export default function Game(screen: Rectangle): Scene<Container> {
+ let instances: GameObject[] = [LaserCannon(screen), ...spawn(Enemy, points)];

  return {
    update(delta) {
      collisionDetect(instances.filter(canCollision).filter(canTransform));

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
      instances
        .filter(canRender)
        .forEach((instance) => render(stage, instance));
    },
  };
}
```

這樣 `spawn` 就完成了。

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
