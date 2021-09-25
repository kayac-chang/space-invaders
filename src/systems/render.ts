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
let pools: DisplayObject[] = [];

export function clear() {
  pools.forEach((obj) => obj.destroy());
  pools = [];

  graphics.clear();
}

function Text(instance: Renderer & Transform) {
  if (instance.renderer.type !== "text") return;

  const src = instance.renderer.src;

  const text = new _Text(src, {
    fontFamily: "VT323",
    fontSize: 16,
    fill: 0xffffff,
  });

  const { x, y } = instance.position;

  text.position.set(x, y);

  pools.push(text);

  return text;
}

export function render(stage: Container, instance: GameObject & Renderer) {
  let child: DisplayObject | undefined;

  if (instance.renderer.type === "graphics" && canTransform(instance)) {
    child = Graphics(graphics, instance);
  }

  if (instance.renderer.type === "text" && canTransform(instance)) {
    child = Text(instance);
  }

  child && stage.addChild(child);
}
