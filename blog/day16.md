# Day16

接下來，卡比想要先去做 **介面 (HUD)**，
方便我們進入到計分系統的時候，可以順便驗證分數。

首先，我們讓畫面能夠渲染 **文字**。

## Text

首先我們要增加新的 `Renderer`，
透過不同的 `type` 區分我們要渲染的畫面物件。

-- `src/types.ts`

```ts
interface GraphicsRenderer {
  renderer: {
    type: "graphics";
    src: number[][];
  };
}

interface TextRenderer {
  renderer: {
    type: "text";
    src: string;
  };
}

export type Renderer = GraphicsRenderer | TextRenderer;
```

## Font

接下來我們要去找接近 70s 8bit 的字體。

-- `src/style.css`

```css
@import url("https://fonts.googleapis.com/css2?family=VT323&display=swap");
```

## Render Text

在 `render` 這邊，
我們要新增一個函式，專門負責產生 `PIXI.Text` 物件到畫面上。

-- `src/systems/render.ts`

```ts
function Text(instance: Renderer) {
  if (instance.renderer.type !== "text") return;

  const src = instance.renderer.src;

  return new _Text(src, {
    fontFamily: "VT323",
    fontSize: 12,
    fill: 0xffffff,
  });
}
```

稍微調整一下 `render` 函式。

```ts
export function render(stage: Container, instance: GameObject & Renderer) {
  let child: DisplayObject | undefined;

  if (instance.renderer.type === "graphics" && canTransform(instance)) {
    child = Graphics(graphics, instance);
  }

  if (instance.renderer.type === "text") {
    child = Text(instance);
  }

  child && stage.addChild(child);
}
```

```diff
function Graphics(
  graphics: _Graphics,
  { renderer, position }: Renderer & Transform
) {
  const src = renderer.src;

  for (let y = 0; y < src.length; y++) {
    for (let x = 0; x < src[y].length; x++) {
      if (src[y][x] === 0) continue;

      graphics.beginFill(0xffffff);

      graphics.drawRect(position.x + x, position.y + y, 1, 1);

      graphics.endFill();
    }
  }

+ return graphics;
}
```

## Mount

接著我們新增一個新的資料夾， `src/HUD` 並建立 `Game.ts`，
專門存放遊戲畫面的介面。

先測試一下文字的渲染是否正常運行。

```ts
export default function GameHUD(): GameObject & Renderer {
  return {
    renderer: {
      type: "text",
      src: "SCORE",
    },
  };
}
```

安置到場景上即可。

-- `src/scenes/Game.ts`

```diff
export default function Game(screen: Rectangle): Scene<Container> {
  let instances: GameObject[] = [
    LaserCannon(screen),
    ...spawn(Enemy, points),
+   GameHUD(),
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

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
