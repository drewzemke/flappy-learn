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

// An approximate normally-distributed random number. Higher samples
// make the distribution closer to normal. Central Limit Theorem, babyyyyy
export function normalRandom(mean = 0, stddev = 1, samples = 6) {
  // Sample the uniform distribution a bunch of times
  let result = 0;
  for (let i = 0; i < samples; i++) result += Math.random();

  // The sum is roughly normally distributed with mean 'samples/2' and stddev 'sqrt(samples/12)'
  // see: https://en.wikipedia.org/wiki/Irwin%E2%80%93Hall_distribution

  // Translate and scale obtain a standard normally-distributed value:
  result -= samples / 2;
  result /= Math.sqrt(samples / 12);

  // Then scale and translate to get the desired mean and stddev:
  return stddev * result + mean;
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

// I just need a clamp function and I don't want to define it everywhere, okay?
// Just a utility function. This probably exists in a library somewhere...
export const clamp = (val, min, max) => {
  if (val < min) return min;
  if (val > max) return max;
  return val;
};
