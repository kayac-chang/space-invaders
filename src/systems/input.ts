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
