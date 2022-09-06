import { addVectors, applyMatrix, dot, sigmoid } from './mathServices';

export class GeneticNeuralNetwork {
  // The 'signature' is an array that specifies the number of neurons in each layer of the NN.
  //  - signature[0] is the size of the input layer
  //  - signature[signature.length-1] is the size of the output layer
  constructor(signature) {
    this._signature = signature;

    // Intentionally initializing fitness to null so I can tell when it's been set
    this._fitness = null;

    // Time to build some arrays babyyyyy
    // (Gonna fill them with zeros though.)
    this._weights = [];
    this._biases = [];
    for (let i = 0; i < signature.length - 1; i++) {
      // If the ith layer has n neurons and the (i+1)th layer has m neurons
      // then we should create an m-by-n matrix of weights and an n-by-1 matrix (column vector)
      // of bias
      const n = signature[i];
      const m = signature[i + 1];
      this._weights.push(Array(m).fill(Array(n).fill(0)));
      this._biases.push(Array(m).fill(0));
    }
  }

  get signature() {
    return this._signature;
  }

  get fitness() {
    return this._fitness;
  }

  set fitness(newFit) {
    this._fitness = newFit;
  }

  get weights() {
    return this._weights;
  }

  get biases() {
    return this._biases;
  }

  // Random initialization method (parameters: mean and stddev??)
  initRandom(mean, stddev) {
    // Throw random values into everything.
    // Replace the expression below with something that samples a normal distribution!
    const genRand = () => stddev * (2 * Math.random() - 1) + mean;

    this._weights = this._weights.map(rows =>
      rows.map(row => Array.from(row, () => genRand()))
    );
    this._biases = this._biases.map(biases =>
      Array.from(biases, () => genRand())
    );
  }

  // Forward compute!
  // Should probably include some error handling in here just in case sizes don't line up?
  compute(input) {
    let vec = input;
    // Iterate through the layers
    for (let i = 0; i < this._signature.length - 1; i++) {
      // Matrix multiply
      vec = applyMatrix(this._weights[i], vec);
      // Add bias
      vec = addVectors(vec, this._biases[i]);
      // Apply sigmoid
      vec = vec.map(sigmoid);
      // Ready for the next iteration!
    }
    return vec;
  }

  // Static method to combine two neural nets with the same signature
  // to generate offspring
  //
  // Params:
  //  - two neural nets (duh)
  //  - mutation rate (probability)
  //  - mutation stddev [need to look up the normal distribution function...]

  // Nicely display an NN.
  toString() {
    let str = '';
    str += `signature: [${this._signature}]\n`;
    str += 'weights:\n';
    this._weights.forEach(rows => {
      rows.forEach(row => {
        str += `[${row}]\n`;
      });
      str += '\n';
    });
    str += 'biases:\n';
    this._biases.forEach(col => {
      col.forEach(el => {
        str += `[${el}]\n`;
      });
      str += '\n';
    });
    return str;
  }
}
