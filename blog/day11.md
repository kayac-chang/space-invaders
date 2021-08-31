# Day11

延續上一回，我們嘗試了 `Function Composition` 的技巧，
這次來試試看將同樣的技巧用於 `Enemy`。

這樣做的目的是，接下來要導入 `Level Design`，
我們可以透過 `Level Design` 的資料，動態生成 `Enemy` 的類型跟位置。

## Base Enemy (Base Function)

首先，在 `src/characters` 底下新增 `src/characters/Enemy.ts`，
將 `Crab`，`Squid`，`Octopus` 程式碼中共同的部分抽離出來，
並透過一些參數來整合成一份。

程式碼如下。

```ts
type EnemyTypes = "squid" | "crab" | "octopus";

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

type Enemy = GameObject & Transform & Renderer & Collision & Shooter;
type Props = {
  type: EnemyTypes;
  position: Vector;
};
export default function Enemy({ type, position }: Props): Enemy {
  const images = EnemyImages[type];

  let current = 0;
  let timePass = 0;

  return {
    position,

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
      src: images[current % images.length],
    },

    collider: {
      size: { x: images[0].length, y: images.length },
    },
  };
}
```

接著，到 `src/scenes/Game.ts` 調整一下。

```diff
export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [
    LaserCannon(screen),
+   Enemy({ type: "crab", position: { x: 0, y: 0 } }),
  ];

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

這樣我們就能根據情境，動態決定要產生何種 `Enemy` 了。

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
