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
  const sig = [6, 1];
  const nn = new GeneticNeuralNetwork(sig);
  nn.initRandom(0, 1);
  console.log(nn.toString());
  const output = nn.compute([1, 2, 3, 4, 5, 6]);
  console.log(output);
  expect(output).not.toBe(null);
  expect(output).toBeDefined();
});

test('should be able to make two NNs and have them reproduce', () => {
  const sig = [2, 3, 1];
  const net1 = new GeneticNeuralNetwork(sig);
  net1.initRandom(0, 1);
  // console.log(net1.toString());
  const net2 = new GeneticNeuralNetwork(sig);
  net2.initRandom(0, 1);
  // console.log(net2.toString());
  const baby = GeneticNeuralNetwork.reproduce(net1, net2, 0.2, 0.1);
  // console.log(baby.toString());
  expect(baby).not.toBe(null);
  expect(baby).toBeDefined();
});
