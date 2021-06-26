export interface Vector {
  x: number;
  y: number;
}

export interface Transform {
  position: Vector;
}

export type Resource = number[][];

export interface Renderer {
  renderer: Resource;
  update?(delta: number): void;
}

export type GameObject = Renderer & Transform;
