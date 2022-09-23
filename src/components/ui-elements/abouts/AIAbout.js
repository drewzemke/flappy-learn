import AboutExpander from './AboutExpander';
import React from 'react';

export default function AIAbout() {
  return (
    <>
      <AboutExpander title='Getting Started'>
        <p>
          If this is your first time here, just ignore the sliders and press{' '}
          <span className='emph'>Start!</span>
        </p>
        <p>
          The game will run with a bunch of artificial intelligence (AI)
          "players" each controlling one of the birds. The game continues until
          every bird has died, at which point you'll be shown some summary
          information and prompted to start the next round.
        </p>
        <p>
          At first, all of the birds will fly around aimlessly and will likely
          run into the floor, ceiling, or the first pipe. That's okay! As the
          rounds go on, the AIs will slowly start to figure out the game, and
          some of the birds will start correctly flying between pipes. After a
          while, the AIs might get the point where they can play the game
          without ever dying.
        </p>
      </AboutExpander>
      <AboutExpander title='About the Simulation'>
        <h2>How do the AIs know what to do?</h2>
        <p>
          Each AI is constantly fed information about the bird it controls. It
          knows its bird's height above the bottom of the screen, how quickly
          its moving up or down, the distance to the next pair of pipes, the
          vertical position of the next pair of pipes, and the vertical position
          of the pair of pipes that's coming up afterwards. Using that
          information, it decides when to tell its bird to jump.
        </p>
        <p>
          Exactly <span className='emph'>how</span> each bird's AI decides when
          to jump is a little complicated (check out the "Nerdy Details,"
          below), but you can think of it like each bird has a genetic code that
          tells it how to convert its observations (e.g., its height, velocity,
          etc) into actions (jumping).
        </p>
        <h2>What happens between rounds?</h2>
        <p>
          At the end of each round, the AIs from that round (collectively
          referred to as that round's "generation") pair off based on how well
          they scored: the AI with the highest score pairs with the AI with the
          second-highest score, the third-highest scorer pairs with the
          fourth-highest, and so on. Each pair "reproduces" to create a new
          generation of AIs that will play the next round.
        </p>
        <p>
          AIs produce offspring similarly to how living organisms do. Each child
          receives each of its traits from one of its parents chosen at random,
          and for each trait there's a possibility of mutation by by a small
          amount.
        </p>
        <p>
          This reproduction scheme is how the "learning" actually happens! AIs
          with traits that help them survive longer in the game will be more
          likely to produce and pass their traits onto children AIs. After tens
          or hundreds of generations, the advantageous traits coalesce to create
          AIs that can play the game without losing. It's natural selection!
        </p>
      </AboutExpander>
      <AboutExpander title={'About the Settings'}>
        <h2>What does each setting do?</h2>
        <p>
          Click the question mark buttons next to each setting in order to see a
          summary of what it does.
        </p>
        <p>
          Note that the "Children Per Pair" setting also controls how many each
          generation's AIs are chosen to reproduce. For example, if the
          genration size is 200 and each parent produces 4 children, the only
          the top 100 AIs will pair off to create the next generation.
        </p>
        <h2>Anything else to watch out for?</h2>
        <p>
          First, note that going back to the AI settings menu will reset the
          simulation! You'll have to start over from Round 1. Sorry!
        </p>
        <p>
          Here are some additional issues that you might run into.
          <ul>
            <li>
              <p>
                Watch out for <span className='emph'>convergence</span> towards
                a losing strategy. Sometimes the entire population of AIs will
                start to act like the best and only strategy is to fly straight
                into the ceiling or drop straight onto the floor, and the only
                thing that will break them out of that loop is a lucky mutation.
                If you see this kind of thing happening, it's often best to just
                reset the simulation and maybe tweak the settings.
              </p>
            </li>
            <li>
              <p>
                Setting the generation size too small makes those kinds of
                convergence issues more likely. Larger generations are better
                (more diversity!), but can cause performance issues on mobile
                devices or slower computers.
              </p>
            </li>
            <li>
              <p>
                Setting "Children Per Pair" too large can run into similar
                convergence issues because it limits diversity. For example, if
                the generation size is 1000 and each pair generates 200
                children, then only the ten highest-scoring AIs pass their genes
                to the next generation.
              </p>
            </li>
          </ul>
        </p>
      </AboutExpander>
      <AboutExpander title='Nerdy Details'>
        <h2>What are the technical names for these things?</h2>
        <p>
          Each "AI" is actually a{' '}
          <a
            href='https://en.wikipedia.org/wiki/Neural_network'
            target='_blank'
            rel='noreferrer'
          >
            neural network
          </a>
          . If you're curious, each network has five input neurons
          (corresponding to the five inputs listed in "About the Simulation"), a
          hidden layer with three neurons, and a single output neuron that can
          trigger a jump. The plan is to eventually expand this app to let you
          change the number of hidden layers and their sizes, but for now it's
          fixed!
        </p>
        <p>
          The algorithm that produces offspring neural networks from parents is
          called a{' '}
          <a
            href='https://en.wikipedia.org/wiki/Genetic_algorithm'
            target='_blank'
            rel='noreferrer'
          >
            genetic algorithm
          </a>
          . This is far from the only way to train a neural network! But it's
          one of the easiest to understand and implement, so it felt like a good
          starting point for this app.
        </p>
        <h2>Where can I learn more about this stuff?</h2>
        <p>
          Neural networks (and machine learning in general) is so popular these
          days that it's difficult to browse the internet and{' '}
          <span className='emph'>not</span> read or see something about it. But
          if you like learning from YouTube videos, you can find a good
          introduction to basic neural networks from{' '}
          <a
            href='https://www.youtube.com/watch?v=hfMk-kjRv4c'
            target='_blank'
            rel='noreferrer'
          >
            Sebastian Lague
          </a>{' '}
          (less mathy) or{' '}
          <a
            href='https://www.youtube.com/watch?v=aircAruvnKk'
            target='_blank'
            rel='noreferrer'
          >
            3Blue1Brown
          </a>{' '}
          (more mathy).
        </p>
      </AboutExpander>
    </>
  );
}
