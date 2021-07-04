# Day4

接下來卡比要是著操作 _LaserCannon_，讓他可以左右移動。

## Input

在上個章節，卡比介紹了 _GameLoop_。

**示意用**

```js
while (true) {
  processesInput();
  update();
  render();
}
```

但是，有個我們還沒有實作到部分，也就是 `processInput`，
這個環節會負責處理玩家輸入的指令，並針對指令產生對應的動作。

各種平台會支援不同的輸入硬件，像是 鍵盤、滑鼠、電玩手把 ...etc。
在這邊，卡比會撰寫如何使用鍵盤來操作遊戲。

### Keyboard Event

在瀏覽器，負責接收鍵盤輸入相關的事件叫做 [KeyboardEvent](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)，
不同於表單用的 `InputEvent`，這個只用來處理當下玩家在鍵盤做了何種操作，屬於比較底層的事件。

而卡比接下來會需要 `keydown` 跟 `keyup` 這兩個事件，
透過這兩個事件來得知玩家按下或放開哪個按鍵。

```ts
document.addEventListener("keydown", (event) => {});

document.addEventListener("keyup", (event) => {});
```

## 實作 InputSystem

首先，在 `types.ts` 增加一個 `enum`。

-- `src/types.ts`

```ts
export enum Key {
  Left,
  Right,
}
```

然後建立一個新的資料夾 `src/systems`，並新建 `src/systems/input.ts`。

有一點需要注意的，就是這個事件的觸發速度跟 `GameLoop` 並不同步，
所以我們需要做一些調整，讓處理速度跟 `GameLoop` 一樣快。

-- `src/systems/input.ts`

```ts
import { Key } from "../types";

let pressed: Set<Key> = new Set();

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.add(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.add(Key.Right);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.delete(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.delete(Key.Right);
  }
});

export function getKeyPressed() {
  return Array.from(pressed);
}
```

這邊我們提供 `getKeyPressed` 讓其他程式碼知道當下玩家按下的按鍵是什麼。
用 Array 或是 Set 來呈現 `pressed` 是因為玩家可能會同時按下兩個以上的按鍵。

接著，我們要將這個資料傳遞到需要使用的物件。

新增 `handleInput` 在 `GameObject` 介面，
因為不是每個物件都需要處理 `handleInput` 跟 `update`，這邊我們採用 `optional chaining`。

-- `src/types.ts`

```diff
export interface GameObject {
+ handleInput?(pressed: Key[]): void;
- update(delta: number): void;
+ update?(delta: number): void;
  render(app: Application): void;
}
```

-- `src/main.ts`

```diff
+ import { getKeyPressed } from "./systems/input";

const app = new Application({
  width: 20,
  height: 20,
  resolution: 10,
});

document.querySelector("#app")?.append(app.view);

+ const instance = LaserCannon();

app.ticker.add(() => {
  app.stage.removeChildren();

+ instance.handleInput?.(getKeyPressed());

- instance.update(app.ticker.deltaMS);
+ instance.update?.(app.ticker.deltaMS);

  instance.render(app.stage);
});
```

然後我們在 `LaserCannon` 裏面實作 `handleInput` 這個方法。

-- `src/characters/LaserCannon.ts`

```ts
export default function LaserCannon(): GameObject {
  return {
    handleInput(pressed) {
      if (pressed.includes(Key.Left)) {
        console.log("move left");
        return;
      }

      if (pressed.includes(Key.Right)) {
        console.log("move right");
        return;
      }
    },

    render(app) {
      const graphics = new Graphics();

      for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
          if (image[y][x] === 0) continue;

          graphics.beginFill(0xffffff);

          graphics.drawRect(x, y, 1, 1);

          graphics.endFill();
        }
      }

      app.stage.addChild(graphics);
    },
  };
}
```

趕快試試看按下去的時候，`console` 會不會印出東西！

## Position

接下來就是讓 _LaserCannon_ 動起來，
我們需要新增一個參數用來記錄每個物件當前的位置。

首先，新增用於記錄位置的型別 `Vector`。
**記得有實作 GameObject 介面的物件都要補上喔！**

-- `src/types.ts`

```ts
export type Vector = {
  x: number;
  y: number;
};
```

```diff
export interface GameObject {
+ position: Vector;
  handleInput?(pressed: Key[]): void;
  update?(delta: number): void;
  render(app: Application): void;
}
```

接下來在 `LaserCannon` 這邊實作 `position`，

並在 `handleInput` 這邊判斷，
假設按下的是左鍵，就往左邊移動 1 px，
假設按下的是右鍵，就往右邊移動 1 px，。

-- `src/characters/LaserCannon.ts`

```diff
export default function LaserCannon(): GameObject {
  return {
+   position: { x: 0, y: 0 },

    handleInput(pressed) {
      if (pressed.includes(Key.Left)) {
-       console.log("move left");
+       this.position.x -= 1;
        return;
      }

      if (pressed.includes(Key.Right)) {
-       console.log("move right");
+       this.position.x += 1;
        return;
      }
    },

    render(app) {
      const graphics = new Graphics();

      for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
          if (image[y][x] === 0) continue;

          graphics.beginFill(0xffffff);

          graphics.drawRect(x, y, 1, 1);

          graphics.endFill();
        }
      }

      app.stage.addChild(graphics);

+     graphics.position.set(this.position.x, this.position.y);
    },
  };
}
```

最後，將位置同步到 `Graphics` 物件上，就可以操作 `LaserCannon` 啦！

對了，畫面太小記得調大一點。

-- `src/main.ts`

```diff
const app = new Application({
- width: 20,
+ width: 80,
- height: 20,
+ height: 80,
- resolution: 10,
+ resolution: 5,
});
```

## 小考題

1. 請問要如何讓 `LaserCannon` 移動範圍不要超過我們的畫面大小呢？

**提示 1**

```ts
function clamp(min: number, max: number, value: number) {
  return Math.max(Math.min(max, value), min);
}
```

**提示 2**
[app.screen](http://pixijs.download/release/docs/PIXI.Application.html#screen)

## 關於兔兔們

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專業)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)
