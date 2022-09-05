import { GameConstants } from './GameConstants';
import create from 'zustand';
import { BirdModel, PipeModel } from './FlappyGameModel';
import { addEffect } from '@react-three/fiber';

export const RunState = {
  WAITING_TO_START: 0,
  RUNNING: 1,
  DEAD: 3,
};

export const useStore = create((set, get) => {
  return {
    initialized: false,
    runState: RunState.WAITING_TO_START,
    score: 0,
    lastRenderTime: Date.now(),
    bird: null,
    pipes: [],
    activePipeIndex: 0,

    //
    // Hi Drew
    //
    // Something is still wrong with the initial positions of the pipes
    // and bird. Fix plz!
    //
    //

    actions: {
      // sets or resets the game
      init: () => {
        set({ initialized: true }); // We're doing it!

        // First, how many pipes do we need?
        const numPipes =
          Math.ceil(GameConstants.SCREEN_WIDTH / GameConstants.PIPE_SPACING) +
          1;
        // Make that many pipes
        const pipes = [];
        for (let i = 0; i < numPipes; i++) {
          const pipeX =
            GameConstants.PIPE_INITIAL_X + i * GameConstants.PIPE_SPACING;
          pipes.push(new PipeModel(pipeX));
        }

        // call the zustand set method
        set({
          // reset the score
          score: 0,
          // new bird
          bird: new BirdModel(
            GameConstants.BIRD_INITIAL_Y,
            GameConstants.BIRD_INITIAL_VEL
          ),
          // pass in the array of pipes we just made
          pipes: pipes,
          // set the first 'active pipe' to be the first one
          activePipeIndex: 0,
        });

        // Do the following each frame...
        addEffect(() => {
          // Don't do shit unless the game is running
          const { runState, lastRenderTime } = get();
          if (runState !== RunState.RUNNING) return;

          // Compute the time since the last render
          const now = Date.now();
          const delta = (now - lastRenderTime) / 1000;
          set({ lastRenderTime: now });

          // Advance the bird and pipes
          const { bird, pipes, activePipeIndex } = get();
          bird.tick(delta);
          pipes.forEach(pipe => pipe.tick(delta));

          // PIPE STUFF ---
          // 1) Check if the pipe to the left of the active pipe has scrolled offscreen,
          //    and reset it to the right if so
          const previousPipeIndex =
            activePipeIndex > 0 ? activePipeIndex - 1 : pipes.length - 1;
          if (
            pipes[previousPipeIndex].position.x <
            -GameConstants.SCREEN_WIDTH / 2 - GameConstants.PIPE_WIDTH / 2
          ) {
            pipes[previousPipeIndex].resetPosition(
              pipes.length * GameConstants.PIPE_SPACING
            );
          }
          // 2) Check if the active pipe has scrolled past where it could collide with the
          //    bird, and advance the active pipe index if so.
          //    Also increase the score, since we passed a pipe :)
          if (
            pipes[activePipeIndex].position.x <
            GameConstants.BIRD_X - GameConstants.BIRD_RADIUS
          ) {
            set(state => ({
              activePipeIndex: (activePipeIndex + 1) % pipes.length,
              score: state.score + 1,
            }));
          }

          // 3: Check for collisions with the active pipe
          const collision =
            testRoomCollisions(bird.position) ||
            testPipeCollisions(bird.position, pipes[activePipeIndex].position);

          if (collision) get().actions.triggerDeath();
        });
      },

      jump: () => {
        get().bird.triggerJump();
      },

      start: () => {
        const { runState, actions } = get();
        if (runState === RunState.WAITING_TO_START) {
          console.log('Starting game!');
        }

        if (runState === RunState.DEAD) {
          console.log('Restarting game!');
          actions.init();
        }
        set({ lastRenderTime: Date.now(), runState: RunState.RUNNING });
      },

      // This should take a bird as an arg eventually
      triggerDeath: () => {
        set({ runState: RunState.DEAD });
      },
    },
  };
});

function testRoomCollisions(birdPos) {
  // First, check if we've hit the top or bottom
  if (
    Math.abs(birdPos.y) + GameConstants.BIRD_RADIUS >
    GameConstants.SCREEN_HEIGHT / 2 + GameConstants.COLLISION_TOLERANCE
  ) {
    console.log('Died by hitting the top or bottom of the screen');
    return true;
  }
}

function testPipeCollisions(birdPos, pipePos) {
  // If we're above or below the gap, we just need to be at least a bird's radius
  // away from the side of the pipe
  if (Math.abs(birdPos.y - pipePos.y) > GameConstants.PIPE_GAP_SIZE / 2) {
    if (
      Math.abs(birdPos.x - pipePos.x) - GameConstants.BIRD_RADIUS <
      GameConstants.PIPE_WIDTH / 2 - GameConstants.COLLISION_TOLERANCE
    ) {
      console.log('Died by hitting the side of a pipe');
      return true;
    }
  }

  // So we're between the gaps vertically. If the bird center is directly above or below
  // the pipes, we just need to be a radius way pipes top/bottom
  if (Math.abs(birdPos.x - pipePos.x) < GameConstants.PIPE_WIDTH / 2) {
    if (
      Math.abs(birdPos.y - pipePos.y) + GameConstants.BIRD_RADIUS >
      GameConstants.PIPE_GAP_SIZE / 2 + GameConstants.COLLISION_TOLERANCE
    ) {
      console.log('Died by hittng the top or bottom of a pipe');
      return true;
    }
  }

  // Last thing: check for collision with the pipe corner
  // Start by finding the coordinates of the closest pipe corner
  const cornerX =
    birdPos.x < pipePos.x
      ? pipePos.x - GameConstants.PIPE_WIDTH / 2
      : pipePos.x + GameConstants.PIPE_WIDTH / 2;
  const cornerY =
    birdPos.y < pipePos.y
      ? pipePos.y - GameConstants.PIPE_GAP_SIZE / 2
      : pipePos.y + GameConstants.PIPE_GAP_SIZE / 2;
  // Compute the distance to the corner and return true if that's closer than the bird radius
  const dist = Math.sqrt(
    (cornerX - birdPos.x) ** 2 + (cornerY - birdPos.y) ** 2
  );

  if (dist < GameConstants.BIRD_RADIUS - GameConstants.COLLISION_TOLERANCE) {
    console.log('Died by hitting a corner');
    return true;
  }

  return false;
}
