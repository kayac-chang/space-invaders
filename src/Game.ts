import { Application, Graphics } from "pixi.js";
import { GameObject } from "./types";
import Matrix from "./Matrix";

export default function Game(
  width: number,
  height: number,
  resolution: number,
) {
  const app = new Application({
    width,
    height,
    resolution,
  });
  document.querySelector("#app")?.append(app.view);

  const pool: GameObject[] = [];

  function add(instance: GameObject) {
    pool.push(instance);
  }

  function render(instance: GameObject) {
    const graphics = new Graphics();

    Matrix.map((value, { x, y }) => {
      if (!value) return;

      graphics.beginFill(0xffffff);
      graphics.drawRect(x, y, 1, 1);
      graphics.endFill();
    }, instance.renderer);

    const { x, y } = instance.position;
    graphics.position.set(x, y);

    return graphics;
  }

  app.ticker.add((delta) => {
    app.stage.removeChildren();

    for (const instance of pool) {
      instance.update?.(delta * app.ticker.FPS);

      app.stage.addChild(render(instance));
    }

    app.render();
  });

  return { add };
}
