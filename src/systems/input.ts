import { Key } from "../types";

let pressed: Set<Key> = new Set();

document.addEventListener("keydown", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.add(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.add(Key.Right);
  }

  if (event.code === "Space") {
    pressed.add(Key.Space);
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowLeft") {
    pressed.delete(Key.Left);
  }

  if (event.code === "ArrowRight") {
    pressed.delete(Key.Right);
  }

  if (event.code === "Space") {
    pressed.delete(Key.Space);
  }
});

export function getKeyPressed() {
  return Array.from(pressed);
}
