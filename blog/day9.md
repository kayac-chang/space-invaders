# Day9

## Collision Behavior

當 `Laser` 跟 `Squid` 相互撞擊時，
我們想要將 `Squid` 從場上移除。
我們需要一個 `event` 讓我們得知發生撞擊，並且需要做什麼事情。

新增一個 `collision` 參數，
當開始發生撞擊時， `start` 函式會被調用，並傳入當前撞擊的物件。

```ts
export interface Collision {
  collider: {
    size: Vector;
  };

  collision?: {
    start?<T extends GameObject & Collision>(this: T, collider: T): void;
  };
}
```

當撞擊發生時執行 `start` 函式，

**note**
我們希望 `start` 函式的 `this` 指向 `GameObject` 本身而非元件，
故使用 `call` 並傳入物件作為 `this`。

```diff
export function collisionDetect(instances: (Collision & Transform)[]) {
  for (let i = 0; i < instances.length; i++) {
    for (let j = i + 1; j < instances.length; j++) {
      const A = instances[i];
      const B = instances[j];

      const o1 = {
        x: A.position.x,
        y: A.position.y,
        w: A.collider.size.x,
        h: A.collider.size.y,
      };
      const o2 = {
        x: B.position.x,
        y: B.position.y,
        w: B.collider.size.x,
        h: B.collider.size.y,
      };

      if (hitTest(o1, o2)) {
+       A.collision?.start?.call(A, B);
+       B.collision?.start?.call(B, A);
      }
    }
  }
}
```

我們需要實作一個機制，讓系統知道我們要銷毀某個物件。
當 `destroy` 被設置成 `true` 時，
我們就要將該物件移除。

```ts
export interface GameObject {
  destroy?: boolean;
  update?(delta: number): void;
}
```

```diff
export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [LaserCannon(screen), Squid()];

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

+       if (instance.destroy) {
+         requestAnimationFrame(() => {
+           instances = instances.filter((_instance) => _instance !== instance);
+         });

+         return;
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

當 `Laser` 撞到其他物件時，就將 `Laser` 自己跟撞擊到的物件移除。

```ts
function Laser({
  x,
  y,
}: Vector): GameObject & Transform & Renderer & Collision {
  return {
    renderer: {
      type: "graphics",
      src: [[1], [1], [1], [1]],
    },

    position: { x, y },

    update() {
      this.position.y -= 1;
    },

    collider: {
      size: { x: 1, y: 4 },
    },

    collision: {
      start(other) {
        other.destroy = true;
        this.destroy = true;
      },
    },
  };
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
