import { GeneticNeuralNetwork } from './GeneticNeuralNet';

test('should be able to create (and print) a NN', () => {
  const sig = [6, 4, 4, 1];
  const nn = new GeneticNeuralNetwork(sig);
  // console.log(nn.toString());
  expect(nn).not.toBe(null);
  expect(nn).toBeDefined();
});

test('should be able to initialize a NN with random values', () => {
  const sig = [2, 4, 1];
  const nn = new GeneticNeuralNetwork(sig);
  nn.initRandom(0, 1);
  // console.log(nn.toString());
  expect(nn).not.toBe(null);
  expect(nn).toBeDefined();
});

test('should be able to compute a NN output', () => {
  const sig = [1, 1];
  const nn = new GeneticNeuralNetwork(sig);
  nn.initRandom(0, 1);
  console.log(nn.toString());
  const output = nn.compute([0]);
  console.log(output);
  expect(output).not.toBe(null);
  expect(output).toBeDefined();
});
