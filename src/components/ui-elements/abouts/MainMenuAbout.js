import React from 'react';
import AboutExpander from './AboutExpander';

export default function MainMenuAbout() {
  return (
    <AboutExpander title='App Info'>
      <h2>What is this?</h2>
      <p>
        It's a recreation of the popular mobile game{' '}
        <a
          href='https://flappybird.io/'
          target='_blank'
          rel='noreferrer'
        >
          Flappy Bird
        </a>{' '}
        originally made by Doug Nguyen. The{' '}
        <span className='emph'>special sauce</span>, if you will, is that there
        are two modes: one where you play the game as normal, and one where you
        get to watch an artificial intelligence{' '}
        <span className='emph'>learn</span> how to play the game.
      </p>
      <p>
        You can also change most of the parameters of game (like jump height,
        space between obstacles, etc.), so you can make the game harder or
        easier for either you or the AI. Check out the "Settings" menu for more
        on that.
      </p>
    </AboutExpander>
  );
}
