# Day7

## Shoot

是時候幫我們的 `LaserCannon` 裝上子彈了！

## Input

首先，當玩家按下 `Space` 時要發射 `Laser`，
所以我們要在 `InputSystem` 新增 `Space`。

```diff
export enum Key {
  Left,
  Right,
+ Space,
}
```

```diff
document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.add(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.add(Key.Right);
  }

+ if (event.code === "Space") {
+   pressed.add(Key.Space);
+ }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.delete(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.delete(Key.Right);
  }

+ if (event.code === "Space") {
+   pressed.delete(Key.Space);
+ }
});
```

## Laser

新增 `Laser`，
`Laser` 會根據 `LaserCannon` 的當前位置變換初始位置，
所以將初始位置定為傳入值，在執行時拋入。

`Laser` 會持續往前移動直到，所以每次畫面更新要增加 `y`。

```ts
function Laser({ x, y }: Vector): GameObject & Transform & Renderer {
  return {
    renderer: {
      type: "graphics",
      src: [[1], [1], [1], [1]],
    },

    position: { x, y },

    update() {
      this.position.y -= 1;
    },
  };
}
```

## Shooter

新增 `Shooter` 元件，以提供發射功能。

```ts
export interface Shooter {
  canShoot: boolean;
  shoot(): GameObject;
}

export function canShoot<T extends GameObject>(
  instance: T
): instance is T & Shooter {
  return "shoot" in instance;
}
```

當 `GameObject` 有 `Shooter` 且 _玩家按下發射_，我們要發射子彈。

透過 `shoot` 函式，在這邊不需要知道實際回傳的物件是什麼，
我們只需要將回傳新增到場景上即可。

一次只需要發射一發，所以執行一次後，記得要將 `canShoot` 切回 `false`。

```diff
export default function Game(screen: Rectangle): Scene<Container> {
+ let instances: GameObject[] = [LaserCannon(screen), Squid()];

  return {
    update(delta) {
      instances.forEach((instance) => {
        if (canControl(instance)) {
          instance.handleInput(getKeyPressed());
        }

+       if (canShoot(instance) && instance.canShoot) {
+         requestAnimationFrame(() => {
+           instances = [...instances, instance.shoot()];
+         });
+         instance.canShoot = false;
+       }

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

## Shooting by Input

首先 `Type` 有點長，我們先重構一下，使其便於讀懂，並加入 `Shooter` 元件。

實作 `Shooter` 元件， `Laser` 的初始位置會根據 `LaserCannon` 的位置更動，
因為我們希望 `Laser` 是在 `LaserCannon` 中間的地方發射，所以要再調整一下數值。

在 `handleInput` 新增按下 `Space` 之後，將 `canShoot` 切成 `true`，
但不希望射擊頻率的太快，所以我們增加了一點冷卻時間，
每 `500ms` 過後才能射擊一次。

```diff
+ type TLaserCannon = GameObject & Transform & Control & Renderer & Shooter;

export default function LaserCannon(screen: {
  width: number;
  height: number;
+ }): TLaserCannon {
+ let timePass = 0;

  return {
    renderer: {
      type: "graphics",
      src: [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    },

    position: { x: 10, y: screen.height - 20 },

+   canShoot: false,
+   shoot() {
+     const { x, y } = this.position;
+     return Laser({ x: x + 5, y: y - 4 });
+   },

    handleInput(this: TLaserCannon, pressed) {
+     if (pressed.includes(Key.Space) && timePass > 500) {
+       this.canShoot = true;
+       timePass = 0;
+     }

      const width = screen.width - this.renderer.src[0].length;

      if (pressed.includes(Key.Left)) {
        this.position.x = clamp(0, width, this.position.x - 1);
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x = clamp(0, width, this.position.x + 1);
        return;
      }
    },

+   update(delta) {
+     timePass += delta;
+   },
  };
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
