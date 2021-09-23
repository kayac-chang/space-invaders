import {
  Container,
  DisplayObject,
  Graphics as _Graphics,
  Text as _Text,
} from "pixi.js";
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

  return graphics;
}

const graphics = new _Graphics();

export function clear() {
  graphics.clear();
}

function Text(instance: Renderer) {
  if (instance.renderer.type !== "text") return;

  const src = instance.renderer.src;

  return new _Text(src, {
    fontFamily: "VT323",
    fontSize: 12,
    fill: 0xffffff,
  });
}

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
