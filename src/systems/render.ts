import { Container, Graphics as _Graphics } from "pixi.js";
import { canTransform, GameObject, Renderer, Transform } from "../types";

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
}

const graphics = new _Graphics();

export function clear() {
  graphics.clear();
}

export function render(stage: Container, instance: GameObject & Renderer) {
  stage.addChild(graphics);

  if (instance.renderer.type === "graphics" && canTransform(instance)) {
    Graphics(graphics, instance);
  }
}
