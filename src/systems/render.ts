import { Container, DisplayObject, Graphics as _Graphics } from "pixi.js";
import {
  canTransform,
  Collision,
  GameObject,
  Renderer,
  Transform,
} from "../types";

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

export function debug(
  stage: Container,
  { position, collider }: GameObject & Transform & Collision
) {
  const graphics = new _Graphics();

  graphics.beginFill(0x6ee7b7);
  graphics.drawRect(position.x, position.y, collider.size.x, collider.size.y);
  graphics.endFill();

  stage.addChild(graphics);
}

export function render(stage: Container, instance: GameObject & Renderer) {
  let renderer: DisplayObject | undefined = undefined;

  if (instance.renderer.type === "graphics") {
    renderer = Graphics(instance);
  }

  if (renderer) {
    stage.addChild(renderer);
  }

  if (renderer && canTransform(instance)) {
    renderer.position.set(instance.position.x, instance.position.y);
  }
}
