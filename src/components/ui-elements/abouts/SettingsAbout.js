import React from 'react';
import AboutExpander from './AboutExpander';

export default function SettingsAbout() {
  return (
    <AboutExpander title='Settings Info'>
      <h2>About</h2>
      <p>
        The default settings are chosen so that the game feels similar to the
        original <span className='emph'>Flappy Bird</span>, but you should feel
        free to change the game however you like.
      </p>
      <p>
        Want an easier experience? Lower the jump height and/or game speed and
        increase the gap size between the pipes. Want to feel like you're
        piloting a fighter jet bird? Increase the speed and the space between
        the pipes.
      </p>
      <p>
        The little question mark circles next to each slider tell you a bit more
        about what the setting does, and you can see how each setting affects
        the game as you change it.
      </p>
      <h2>Note!</h2>
      <p>
        It's possible to create a game that is impossible to play! For instance,
        you can set the jump velocity so high that your poor bird flies straight
        into the ceiling, or you can make the spacing between the pipes too
        small to fit through.
      </p>
      <p>
        That said, it's quite satisfying to make the game extremely difficult
        (but still playable) and then train the AI to play it. The AI will take
        longer to learn, but it'll eventually figure it out!
      </p>
    </AboutExpander>
  );
}
