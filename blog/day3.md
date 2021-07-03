# Day3

## 軟體架構

這邊卡比要介紹一個名詞，
[Software Architecture 軟體架構](https://en.wikipedia.org/wiki/Software_architecture#:~:text=Software%20architecture%20refers%20to%20the,of%20both%20elements%20and%20relations.)。

`軟體架構` 旨在如何更好的處理各個程式碼段落之間的溝通，
雖然並不會讓你的程式碼增加什麼新的功能，但能讓撰寫程式碼變得更容易判讀，

但如果做完之後反而變累贅或是更難懂的時候，重新思考一下，
`Don't overengineer your code`。

## GameLoop

如果要論遊戲程式設計最關鍵的部分，那一定是 `GameLoop`。

`Loop` 的概念在現代開發時常出現，像是 `REPL (Read-Eval-Print Loop)`、 `Event Loop` ...etc.
同樣的概念在遊戲程式中，一樣存在一個 `Loop`，
並會以下面的方式，重複的執行動作，直到使用者主動關閉程式。

**示意用**

```js
while (true) {
  processesInput();
  update();
  render();
}
```

根據平台與工具的不同，
實作方式可能會有差異，但主要的思考方向不變，
像是在 `Web` 端， `JavaScript` 是無法直接對底層直接做操作的，
必須透過 `requestAnimationFrame` 等 API 來實現 `GameLoop`。

實際上，卡比在前一天就已經實作 `GameLoop` 了，
但是接下來，卡比會做一些調整。

## 介面

隨著程式的功能越來越複雜，如果將所有的邏輯，都寫在一個函式的話，
最後程式碼會變的難以理解跟維護，
所以卡比會開始整理這些邏輯跟功能到對應的物件進行封裝。

但是，不同的物件會有不同的實作內容，我們需要定義一個共同的 `interface`，
`GameLoop` 不需要了解是什麼物件，但是知道實作 `interface` 一定會有其定義的 `method`，
他只需要去執行那個 `method` 即可。

卡比接下來示範如何用 `interface` 定義 `update` 以及 `render`，來規範架構。

## 實作

首先建立一個新的檔案 `src/types.ts`，

-- `src/types.ts`

```ts
import { Container } from "pixi.js";

export interface GameObject {
  update(delta: number): void;
  render(stage: Container): void;
}
```

然後，在 `src/characters/Crab.ts`，
卡比將實作 `GameObject` 介面，並將他回傳出去。

-- `src/characters/Crab.ts`

```ts
export default function Crab(): GameObject {
  let current = 0;
  const images = [image, image2];

  let timePass = 0;

  return {
    update(delta) {
      timePass += delta;

      if (timePass > 1000) {
        current += 1;
        timePass = 0;
      }
    },

    render(stage) {
      const graphics = new Graphics();

      const image = images[current % images.length];

      for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[y].length; x++) {
          if (image[y][x] === 0) continue;

          graphics.beginFill(0xffffff);

          graphics.drawRect(x, y, 1, 1);

          graphics.endFill();
        }
      }

      stage.addChild(graphics);
    },
  };
}
```

最後在 `src/main.ts`。

-- `src/main.ts`

```ts
const app = new Application({
  width: 20,
  height: 20,
  resolution: 10,
});

document.querySelector("#app")?.append(app.view);

const instance = Crab();

app.ticker.add(() => {
  app.stage.removeChildren();

  instance.update(app.ticker.deltaMS);

  instance.render(app.stage);
});
```

接著確認有沒有出現錯誤，或是任何非預期行為，
如果沒有那重構就成功了。

## 小考題

1. 請幫 `Crab`，`LaserCannon`，`Octopus`，`Squid` 也進行重構。

2. 請在場上同時顯示 `Crab`，`LaserCannon`，`Octopus`，`Squid`。

## 關於兔兔們

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專業)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)
