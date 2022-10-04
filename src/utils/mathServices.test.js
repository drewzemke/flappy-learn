import { addVectors, applyMatrix, dot, normalRandom } from './mathServices';

test('dot product of two vectors should compute correctly', () => {
  const u = [1, 2, 3];
  const v = [-1, 3, 1];
  expect(dot(u, v)).toBe(8);
});

test('dot product of vector with itself should compute correctly', () => {
  const u = [1, 2, 3];
  expect(dot(u, u)).toBe(14);
});

test('vector addition should compute correctly', () => {
  const u = [1, 2, 3];
  const v = [-1, 3, 1];
  expect(addVectors(u, v)).toStrictEqual([0, 5, 4]);
});

test('matrix multiplication compute correctly', () => {
  const M = [
    [1, 2, 3],
    [1, 0, 3],
  ];
  const u = [1, 2, 3];
  expect(applyMatrix(M, u)).toStrictEqual([14, 10]);
});

test('sampling random distribution should work ', () => {
  let vals = Array(10).fill(0);
  vals = vals.map(() => normalRandom());
  // console.log(vals);
  expect(vals.length).toBeGreaterThan(0);
});
