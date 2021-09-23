import { GameObject, Renderer } from "../types";

export default function GameHUD(): GameObject & Renderer {
  return {
    renderer: {
      type: "text",
      src: "SCORE",
    },
  };
}
