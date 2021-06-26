import { Vector } from "./types";

function Matrix<T>(
  width = 0,
  height = 0,
  fill?: T,
): T[][] {
  return Array(height).fill(undefined).map(() => Array(width).fill(fill));
}

type MapFn<T, V> = (value: T, index: Vector) => V;
function map<T, V>(fn: MapFn<T, V>, matrix: T[][]): V[][] {
  const result = Matrix<V>(matrix[0]?.length, matrix.length);

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      result[y][x] = fn(matrix[y][x], { x, y });
    }
  }

  return result;
}

Matrix.map = map;
export { map };
export default Matrix;
