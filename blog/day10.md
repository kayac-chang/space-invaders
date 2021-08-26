# Day10

接下來，要幫 `Squid` 也裝上 `Laser`，
敵人的 `Laser` 跟我們的外觀是不一樣的，
但是卡比希望可以利用原本已經寫好的 `Laser` 函式，
減少重複的程式碼。

## Function Composition

首先，新建一個資料夾 `src/army` 並建立 `src/army/index.ts`，
將 `Laser` 搬到 `src/army/index.ts`，
並將其重構成 `Base`，用來當我們的基礎。

```ts
type Army = GameObject & Transform & Renderer & Collision;
type BaseProps = {
  src: number[][];
  position: Vector;
  update: (army: Army) => void;
};
function Base({ src, position, update }: BaseProps): Army {
  return {
    renderer: {
      type: "graphics",
      src,
    },

    position,
    update() {
      update(this);
    },

    collider: {
      size: { x: src[0].length, y: src.length },
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

接著，建立 `Laser`。

```ts
type LaserProps = Omit<BaseProps, "src">;
export function Laser({ position, update }: LaserProps) {
  return Base({ src: [[1], [1], [1], [1]], position, update });
}
```

並透過 `LaserCannon` 來提供我們 `position` 跟 `update`。

```diff
export default function LaserCannon(screen: {
  width: number;
  height: number;
}): TLaserCannon {
  let timePass = 0;

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

    canShoot: false,
    shoot() {
      const { x, y } = this.position;

+     return Laser({
+       position: { x: x + 5, y: y - 4 },
+       update(it) {
+         it.position.y -= 1;
+       },
+     });
    },

    handleInput(this: TLaserCannon, pressed) {
      if (pressed.includes(Key.Space) && timePass > 500) {
        this.canShoot = true;
        timePass = 0;
      }

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

    update(delta) {
      timePass += delta;
    },
  };
}
```

## Enemy Laser

接著來建立 `EnemyLaser`，
因為我們將一些邏輯共用了，所以很快就可以做出來。

```ts
export function EnemyLaser({ position, update }: LaserProps) {
  return Base({
    src: [
      [0, 1, 0],
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
      [0, 1, 0],
      [1, 0, 0],
      [0, 1, 0],
    ],
    position,
    update,
  });
}
```

調整一下 `Squid`，使其每一秒射擊一次，便大功告成了。

```ts
type Enemy = GameObject & Transform & Renderer & Collision & Shooter;
export default function Squid(): Enemy {
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
        this.canShoot = true;
      }
    },

    canShoot: false,
    shoot() {
      const { x, y } = this.position;
      const [w, h] = [image1[0].length, image1.length];

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
      size: { x: image1[0].length, y: image1.length },
    },
  };
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
