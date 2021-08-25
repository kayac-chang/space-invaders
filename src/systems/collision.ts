import { Collision, Transform, Rect } from "../types";

function points({ x, y, w, h }: Rect) {
  return [x, x + w, y, y + h];
}

function hitTest(o1: Rect, o2: Rect) {
  const [a1, a2, a3, a4] = points(o1);
  const [b1, b2, b3, b4] = points(o2);

  return [
    a2 >= b1,
    a1 <= b2,
    a4 >= b3,
    a3 <= b4,
    //
  ].every(Boolean);
}

export function collisionDetect(instances: (Collision & Transform)[]) {
  for (let i = 0; i < instances.length; i++) {
    for (let j = i + 1; j < instances.length; j++) {
      const A = instances[i];
      const B = instances[j];

      const o1 = {
        x: A.position.x,
        y: A.position.y,
        w: A.collider.size.x,
        h: A.collider.size.y,
      };
      const o2 = {
        x: B.position.x,
        y: B.position.y,
        w: B.collider.size.x,
        h: B.collider.size.y,
      };

      if (hitTest(o1, o2)) {
        A.collision?.start?.call(A, B);
        B.collision?.start?.call(B, A);
      }
    }
  }
}
