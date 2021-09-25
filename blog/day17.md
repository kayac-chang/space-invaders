# Day17

開始做 **介面 (HUD)**，
接下來都是用之前有實作過的技巧！

## Render

因為要調整 `Text` 的位置，我們需要調整一下 `render`。

```diff
function Text(instance: Renderer & Transform) {
  if (instance.renderer.type !== "text") return;

  const src = instance.renderer.src;

+ const text = new _Text(src, {
    fontFamily: "VT323",
    fontSize: 16,
    fill: 0xffffff,
  });

+ const { x, y } = instance.position;
+ text.position.set(x, y);

+ return text;
}

export function render(stage: Container, instance: GameObject & Renderer) {
  let child: DisplayObject | undefined;

  if (instance.renderer.type === "graphics" && canTransform(instance)) {
    child = Graphics(graphics, instance);
  }

+ if (instance.renderer.type === "text" && canTransform(instance)) {
    child = Text(instance);
  }

  child && stage.addChild(child);
}
```

## Base Function

透過定義 `Base Function` 根據 `props` 的不同產生不同 `Text`。

```ts
type IText = GameObject & Renderer & Transform;

type TextProps = {
  src: string;
  position: Vector;
};
function Text({ src, position }: TextProps): IText {
  return {
    renderer: {
      type: "text",
      src,
    },
    position,
  };
}
```

## Score Component

透過 `Array` 下去做 `Group`。

```ts
type ScoreProps = {
  title: string;
  value?: number;
  x: number;
};
function Score({ title, value, x }: ScoreProps): IText[] {
  return [
    Text({ src: title, position: { x, y: 0 } }),
    Text({
      src: value ? String(value).padStart(4, "0") : "",
      position: { x: x + 12, y: 12 },
    }),
  ];
}
```

## Mount

組合這些畫面元件。

```ts
export default function GameHUD(): IText[] {
  return [
    ...Score({ title: "SCORE<1>", value: 70, x: 10 }),
    ...Score({ title: "HI-SCORE", value: 880, x: 90 }),
    ...Score({ title: "SCORE<2>", x: 160 }),
  ];
}
```

調整一下就完成了。

-- `src/scenes/Game.ts`

```diff
export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [
    LaserCannon(screen),
    ...spawn(Enemy, points),
+   ...GameHUD(),
  ];

  const update = ap(
    SequentialMovement({
      counts: instances.filter(isEnemy).length,
      step: 2,
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

## Optimization

這時應該會再度遇到記憶體問題，我們要將每次產生出來的 `PIXI.Text` 釋放掉。

```ts
const graphics = new _Graphics();
let pools: DisplayObject[] = [];

export function clear() {
  pools.forEach((obj) => obj.destroy());
  pools = [];

  graphics.clear();
}
```

```diff
function Text(instance: Renderer & Transform) {
  if (instance.renderer.type !== "text") return;

  const src = instance.renderer.src;

  const text = new _Text(src, {
    fontFamily: "VT323",
    fontSize: 16,
    fill: 0xffffff,
  });

  const { x, y } = instance.position;

  text.position.set(x, y);

+ pools.push(text);

  return text;
}
```

這樣就不會因為 `PIXI.Text` 而產生記憶體問題。

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
