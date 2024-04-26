
export const lerp = (start: number, target: number, easing: number) => {
  return start + (target - start) * easing;
};