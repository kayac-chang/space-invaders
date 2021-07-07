import { clamp } from "../functions/utils";
import { Control, GameObject, Key, Renderer, Transform } from "../types";

export default function LaserCannon(
  screen: { width: number; height: number },
): GameObject & Transform & Control & Renderer {
  return {
    renderer: {
      type: "graphics",
      src: [
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      ],
    },

    position: { x: 10, y: screen.height - 20 },

    handleInput(this: Renderer & Transform, pressed) {
      const width = screen.width - this.renderer.src[0].length;

      if (pressed.includes(Key.Left)) {
        this.position.x = clamp(0, width, this.position.x - 1);
        return;
      }

      if (pressed.includes(Key.Right)) {
        this.position.x = clamp(0, width, this.position.x + 1);
        return;
      }
    },
  };
}
