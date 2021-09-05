import "./style.css";
import { Application } from "pixi.js";
import Game from "./scenes/Game";

const app = new Application({
  width: 224,
  height: 256,
  resolution: 3,
});

document.querySelector("#app")?.append(app.view);

const scene = Game(app.screen);

app.ticker.add(() => {
  app.stage.removeChildren();

  scene.update?.(app.ticker.deltaMS);

  scene.render(app.stage);
});
