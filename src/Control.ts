export enum Key {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
}

let current: Key | undefined = undefined;

window.addEventListener("keydown", (event) => {
  if (event.code === Key.ArrowLeft) {
    current = Key.ArrowLeft;
    return;
  }

  if (event.code === Key.ArrowRight) {
    current = Key.ArrowRight;
    return;
  }

  current = undefined;
});

window.addEventListener("keyup", () => {
  current = undefined;
});

export function getKeyDown() {
  return current;
}
