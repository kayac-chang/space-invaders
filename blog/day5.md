# Day5

寫程式寫到一定的階段後，會開始發現，其實做出想要的功能並不困難。
真正難的，其實是如何寫出有彈性的程式碼以應對各種需求跟變化。
卡比接下來要做的，是在一般遊戲引擎都會實作的設計模式，_Component_。

## Entity (GameObject) Component and System

在遊戲設計中的 _Component_ 跟 Web 的 _Component_ 不同，
這邊的 _Component_ 是用來提供 _GameObject_ 行為的。

不過卡比會進一步將邏輯跟資料的部分在拆出來，
讓 _Component_ 用於封裝資料， _System_ 用於處理邏輯。

## Renderer Component and Render System

卡比注意到，目前每個遊戲角色都有一個類似的 `render` 函式，
而這部分的程式碼幾乎一樣，我們來試試看能不能將他共用。

首先，先在 `src/types.ts` 定義新的介面。

-- `src/types.ts`

```ts
export interface Renderer {
  renderer: {
    type: "graphics";
    src: number[][];
  };
}
```

並修改 `GameObject`，

```diff
export interface GameObject {
  handleInput?(pressed: Key[]): void;
  update?(delta: number): void;
- render(app: Application): void;
}
```

接著，卡比以 `src/characters/LaserCannon.ts` 作為範例，進行修改
注意到，卡比在這邊用了 `Type Intersections` 的方式來延展 `GameObject`。

-- `src/characters/LaserCannon.ts`

```ts
export default function LaserCannon(): GameObject & Renderer {
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

    position: { x: 0, y: 0 },

    handleInput(pressed) {
      if (pressed.includes(Key.Left)) {
        this.position.x -= 1;
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x += 1;
        return;
      }
    },
  };
}
```

建立新的檔案 `src/systems/render.ts`，
專門用來處理 `render` 相關的邏輯。

```ts
function Graphics({ renderer }: Renderer) {
  const src = renderer.src;
  const graphics = new _Graphics();

  for (let y = 0; y < src.length; y++) {
    for (let x = 0; x < src[y].length; x++) {
      if (src[y][x] === 0) continue;

      graphics.beginFill(0xffffff);

      graphics.drawRect(x, y, 1, 1);

      graphics.endFill();
    }
  }

  return graphics;
}

export function render(stage: Container, instance: GameObject & Renderer) {
  let renderer: DisplayObject | undefined = undefined;

  if (instance.renderer.type === "graphics") {
    renderer = Graphics(instance);
  }

  if (renderer) {
    stage.addChild(renderer);

    renderer.position.set(instance.position.x, instance.position.y);
  }
}
```

接著，更改 `src/main.ts` 來接上我們的 _Render System_ 。

```ts
app.ticker.add(() => {
  app.stage.removeChildren();

  instance.handleInput?.(getKeyPressed());

  instance.update?.(app.ticker.deltaMS);

  render(app.stage, instance);
});
```

確認畫面運作沒問題，我們的重構就完成了。

## Transform System

接下來，將 `LaserCannon` 的其他程式碼也一併 _Component_ 化。

-- `src/types.ts`

```ts
export type Vector = {
  x: number;
  y: number;
};

export interface Transform {
  position: Vector;
}

export interface Control {
  handleInput(pressed: Key[]): void;
}

export interface GameObject {
  update?(delta: number): void;
}
```

-- `src/characters/LaserCannon.ts`

```ts
import { clamp } from "../functions/utils";
import { Control, GameObject, Key, Renderer, Transform } from "../types";

export default function LaserCannon(): GameObject &
  Transform &
  Control &
  Renderer {
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

    position: { x: 10, y: 10 },

    handleInput(pressed) {
      if (pressed.includes(Key.Left)) {
        this.position.x -= 1;
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x += 1;
        return;
      }
    },
  };
}
```

因為我們將 `render` 相關的邏輯移到 `Render System`，
但還未實作 `Transform` 的相關邏輯。

在 `System` 中，我們需要過濾被傳入的物件是否擁有 `Transform` 元件，
如果擁有 `Transform` 才需要執行 `position` 相關的邏輯操作。

-- `src/types.ts`

```ts
export function canTransform<T extends GameObject>(
  instance: T
): instance is T & Transform {
  return "position" in instance;
}
```

-- `src/systems/render.ts`

```diff
export function render(stage: Container, instance: GameObject & Renderer) {
  let renderer: DisplayObject | undefined = undefined;

  if (instance.renderer.type === "graphics") {
    renderer = Graphics(instance);
  }

  if (renderer) {
    stage.addChild(renderer);
  }

+ if (renderer && canTransform(instance)) {
+   renderer.position.set(instance.position.x, instance.position.y);
+ }
}
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
