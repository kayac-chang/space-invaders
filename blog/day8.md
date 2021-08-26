# Day8

## Collision Detection

接下來我們要讓 `Laser` 打中敵人時，將敵人消滅。
`Laser` 要有辦法偵測到目前打中誰，
所以需要一個新的功能來檢測目前哪幾個物件是互相重疊的，
這個就是 **撞擊檢測 (Collision Detection)**

**Collision Detection** 根據形狀的不同，實作的演算方式也不同。
這邊卡比用相對簡單的 `Rect to Rect` 檢測即可。

大致的演算方式如下：

```ts
interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function points({ x, y, w, h }: Rect) {
  return [x, x + w, y, y + h];
}

function hitTest(o1: Rect, o2: Rect) {
  const [a1, a2, a3, a4] = points(o1);
  const [b1, b2, b3, b4] = points(o2);

  return [
    a2 >= b1,
    a1 <= b2,
    a4 >= b3,
    a3 <= b4,
    //
  ].every(Boolean);
}

export function collisionDetect(instances: GameObject[]) {
  for (let i = 0; i < instances.length; i++) {
    for (let j = i + 1; j < instances.length; j++) {
      if (hitTest(o1, o2)) {
        //...
      }
    }
  }
}
```

## Collider

接下來就是要將我們的撞擊邏輯元件化，
我們需要新增一個元件 `Collider`，
用於提供我們撞擊檢測中需要的資料，像是 `width` 和 `height`。

```ts
export interface Collision {
  collider: {
    size: Vector;
  };
}

export function canCollision<T extends GameObject>(
  instance: T
): instance is T & Collision {
  return "collider" in instance;
}
```

接著讓 `Laser` 跟 `Squid` 有辦法相撞。

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
  };
}
```

```ts
export default function Squid(): GameObject & Transform & Renderer & Collision {
  const images = [image1, image2];

  let current = 0;
  let timePass = 0;

  return {
    position: { x: 0, y: 0 },

    update(delta) {
      timePass += delta;

      if (timePass > 1000) {
        current += 1;
        timePass = 0;

        this.renderer.src = images[current % images.length];
      }
    },

    renderer: {
      type: "graphics",
      src: images[current % images.length],
    },

    collider: {
      size: { x: image1[0].length, y: image1.length },
    },
  };
}
```

接著，在 `Game` 加入 `collisionDetect`。

```ts
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

## Collision Detect System

將 `Rect` 移動到 `types`。

```ts
export interface Rect extends Vector {
  w: number;
  h: number;
}
```

接著，將實作完剛才的 `collisionDetect` 函式。

```ts
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
        console.log("hit");
      }
    }
  }
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
