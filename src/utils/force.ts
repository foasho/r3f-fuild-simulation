import { Vector2 } from 'three';

/**
 * 外力を計算する
 * @param diff pointerの差分
 * @param mouseForce マウスの力(規定値: 20)
 * @returns 
 */
export const calcForce = (
  diff: Vector2,
  mouseForce: number = 20
) => {
  const forceX = diff.x * mouseForce;
  const forceY = diff.y * mouseForce;
  return new Vector2(forceX, forceY);
}