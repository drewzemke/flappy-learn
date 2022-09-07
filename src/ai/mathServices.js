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

// Returns a randomly selected index from a sorted list of weights
// - The values in 'weights' must add to one!
// - 'maxQuota' is a number between 0 and 1 that reduces the amount
//   range from which the index is picked.
export function sampleWeightedList(weights, maxQuota) {
  let weightRemaining = maxQuota * Math.random();
  let index = -1;
  while (weightRemaining > 0) {
    index++;
    weightRemaining -= weights[index];
  }
  console.log(`Selecting parent ${index}`);
  return index;
}
