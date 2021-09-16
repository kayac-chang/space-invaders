export enum Key {
  Left,
  Right,
  Space,
}

export type Vector = {
  x: number;
  y: number;
};
export interface Rect extends Vector {
  w: number;
  h: number;
}

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

export interface Collision {
  collider: {
    size: Vector;
  };

  collision?: {
    start?<T extends GameObject & Collision>(this: T, collider: T): void;
  };
}

export interface GameObject {
  tags?: string[];
  destroy?: boolean;
  update?(delta: number): void;
}

export interface Scene<T> extends GameObject {
  render(stage: T): void;
}

export function canTransform<T extends GameObject>(
  instance: T
): instance is T & Transform {
  return "position" in instance;
}

export function canControl<T extends GameObject>(
  instance: T
): instance is T & Control {
  return "handleInput" in instance;
}

export function canRender<T extends GameObject>(
  instance: T
): instance is T & Renderer {
  return "renderer" in instance;
}

export interface Shooter {
  canShoot: boolean;
  shoot(): GameObject;
}

export function canShoot<T extends GameObject>(
  instance: T
): instance is T & Shooter {
  return "shoot" in instance;
}

export function canCollision<T extends GameObject>(
  instance: T
): instance is T & Collision {
  return "collider" in instance;
}
