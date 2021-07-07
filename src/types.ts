export enum Key {
  Left,
  Right,
}

export type Vector = {
  x: number;
  y: number;
};

export interface Transform {
  position: Vector;
}

export interface Control {
  handleInput(pressed: Key[]): void;
}

export interface Renderer {
  renderer: {
    type: "graphics";
    src: number[][];
  };
}

export interface GameObject {
  update?(delta: number): void;
}

export interface Scene<T> extends GameObject {
  render(stage: T): void;
}

export function canTransform<T extends GameObject>(
  instance: T,
): instance is T & Transform {
  return "position" in instance;
}

export function canControl<T extends GameObject>(
  instance: T,
): instance is T & Control {
  return "handleInput" in instance;
}

export function canRender<T extends GameObject>(
  instance: T,
): instance is T & Renderer {
  return "renderer" in instance;
}
