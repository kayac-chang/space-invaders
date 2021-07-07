import { Application } from "pixi.js";

export enum Key {
  Left,
  Right,
}

export type Vector = {
  x: number;
  y: number;
};

export interface Transfrom {
  position: Vector;
}

export interface Control {
  handleInput(pressed: Key[]): void;
}

export interface GameObject {
  update?(delta: number): void;
  render(app: Application): void;
}

export interface Scene extends GameObject {
}
