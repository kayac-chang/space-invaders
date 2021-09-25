import { GameObject, Renderer, Transform, Vector } from "../types";

type IText = GameObject & Renderer & Transform;

type TextProps = {
  src: string;
  position: Vector;
};
function Text({ src, position }: TextProps): IText {
  return {
    renderer: {
      type: "text",
      src,
    },
    position,
  };
}

type ScoreProps = {
  title: string;
  value?: number;
  x: number;
};
function Score({ title, value, x }: ScoreProps): IText[] {
  return [
    Text({ src: title, position: { x, y: 0 } }),
    Text({
      src: value ? String(value).padStart(4, "0") : "",
      position: { x: x + 12, y: 12 },
    }),
  ];
}

export default function GameHUD(): IText[] {
  return [
    ...Score({ title: "SCORE<1>", value: 70, x: 10 }),
    ...Score({ title: "HI-SCORE", value: 880, x: 90 }),
    ...Score({ title: "SCORE<2>", x: 160 }),
  ];
}
