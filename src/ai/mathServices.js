// Should this include some error handling for improper sizes? ._.
export function applyMatrix(matrix, vector) {
  return matrix.map(row => dot(row, vector));
}

export function dot(u, v) {
  return u.reduce((prev, curr, index) => prev + u[index] * v[index], 0);
}

export function addVectors(u, v) {
  return u.map((el, index) => el + v[index], 0);
}

export function sigmoid(z) {
  return 1.0 / (1 + Math.exp(-z));
}
