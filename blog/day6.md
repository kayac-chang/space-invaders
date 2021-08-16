# Day6

## Scenes

在 `Web` 的領域裡，一個網站會有頁面，像是 Main Page, Login Page, Dashboard ... etc。
`Game` 裡面也有類似的概念，我們稱之為 `Scene` 場景。

每個 `Scene` 會有不同的目的，
根據目的的不同，`Scene` 需要的實作方式也不一樣，
但是我們一樣可以設計出一個共同的介面，
讓 `Scene` 可以與 `GameLoop` 這兩個 `Pattern` 進行串接。

-- `src/types.ts`

```ts
export interface Scene<T> extends GameObject {
  render(stage: T): void;
}
```

## Game Scene

接下來我們要實作 Game Scene，用於主遊戲的場景。
建立一個新的資料夾 `scenes` 並建立 `Game.ts`。

-- `src/scenes/Game.ts`

```ts
import { Container, Rectangle } from "pixi.js";
import LaserCannon from "../characters/LaserCannon";
import Squid from "../characters/Squid";
import { GameObject, Scene } from "../types";

export default function Game(): Scene<Container> {
  const instances: GameObject[] = [LaserCannon(), Squid()];

  return {
    render(stage) {},
  };
}
```

-- `src/main.ts`

```diff
+ import Game from "./scenes/Game";

const app = new Application({
  width: 80,
  height: 80,
  resolution: 5,
});

document.querySelector("#app")?.append(app.view);

- const instance = LaserCannon();
+ const scene = Game();

app.ticker.add(() => {
  app.stage.removeChildren();

- instance.handleInput?.(getKeyPressed());
- instance.update?.(app.ticker.deltaMS);

- instance.render(app.stage);
+ scene.render(app.stage);
});
```

接著將 `update` 跟 `render` 的相關邏輯移到 `scene`。

為了知道哪些物件用有 `render` 的元件跟 `handleInput` 元件，
跟上一個章節一樣，我們要新增判斷函式。

-- `src/types.ts`

```ts
export function canControl<T extends GameObject>(
  instance: T
): instance is T & Control {
  return "handleInput" in instance;
}

export function canRender<T extends GameObject>(
  instance: T
): instance is T & Renderer {
  return "renderer" in instance;
}
```

-- `src/scenes/Game.ts`

```ts
import { canControl, canRender, GameObject, Scene } from "../types";

export default function Game(): Scene<Container> {
  const instances: GameObject[] = [LaserCannon(), Squid()];

  return {
    update(delta) {
      instances.forEach((instance) => {
        if (canControl(instance)) {
          instance.handleInput(getKeyPressed());
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

接著在 `GameLoop` 執行 `scene.update`，
我們就成功接上 `GameLoop` 跟 `Scene` 這兩個 `Pattern` 了。

-- `src/main.ts`

```diff
import Game from "./scenes/Game";

const app = new Application({
  width: 80,
  height: 80,
  resolution: 5,
});

document.querySelector("#app")?.append(app.view);

const scene = Game();

app.ticker.add(() => {
  app.stage.removeChildren();

+ scene.update?.(app.ticker.deltaMS);

  scene.render(app.stage);
});
```

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
