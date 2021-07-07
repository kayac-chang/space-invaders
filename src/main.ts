import "./style.css";
import { Application } from "pixi.js";
import { Scene } from "./types";
import Game from "./scenes/Game";

const app = new Application({
  width: 80,
  height: 80,
  resolution: 5,
});

document.querySelector("#app")?.append(app.view);

function run(scene: Scene) {
  app.ticker.add(() => {
    app.stage.removeChildren();

    scene.update?.(app.ticker.deltaMS);

    scene.render(app);
  });
}

run(Game());
