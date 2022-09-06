import { addVectors, applyMatrix, dot, sigmoid } from './mathServices';

test('dot product should work', () => {
  const u = [1, 2, 3];
  const v = [-1, 3, 1];
  expect(dot(u, v)).toBe(8);
});

test('dot product should work again', () => {
  const u = [1, 2, 3];
  expect(dot(u, u)).toBe(14);
});

test('vector add should work', () => {
  const u = [1, 2, 3];
  const v = [-1, 3, 1];
  expect(addVectors(u, v)).toStrictEqual([0, 5, 4]);
});

test('matrix multiplication should work', () => {
  const M = [
    [1, 2, 3],
    [1, 0, 3],
  ];
  const u = [1, 2, 3];
  expect(applyMatrix(M, u)).toStrictEqual([14, 10]);
});
