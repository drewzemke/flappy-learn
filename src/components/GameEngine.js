import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef, useState } from 'react';
import { Bird } from '../game-elements/Bird';
import { Pipe } from '../game-elements/Pipe';
import { FlappyBirdGameModel, RunState } from '../game-model/FlappyGameModel';
import { usePlayerControl } from '../hooks/controlHooks';
import { GameVisor } from './GameVisor';

export default function GameEngine() {
  const gameModel = useRef(new FlappyBirdGameModel());
  const birdMeshRefs = useRef([]);
  const pipeGroupRefs = useRef([]);

  const [runState, setRunState] = useState(RunState.WAITING_TO_START);
  const [score, setScore] = useState(0);

  function handleJump(event) {
    if (!event || event.code === 'Space') {
      gameModel.current.triggerJump();
    }
  }
  usePlayerControl(handleJump);

  // Use the enter key to start/restart the game
  useEffect(() => {
    window.addEventListener('keydown', handleEnter);
    return () => {
      window.removeEventListener('keydown', handleEnter);
    };
  }, []);
  function handleEnter(event) {
    if (event.code === 'Enter') {
      gameModel.current.start();
    }
  }

  // useFrame should do two main things
  useFrame((state, delta) => {
    // 1) call model.tick(delta) or whatever to advance the game state
    gameModel.current.tick(delta);

    // Do some shady BS and set some state in useFrame
    // We don't even need to use these???
    // ... This is not good practice and I should find a way to do it right
    setRunState(gameModel.current.state.runState);
    setScore(gameModel.current.state.score);

    // 2) update the displayed meshes via their refs
    // bird(s)
    const birdPos = gameModel.current.state.birdPosition;
    birdMeshRefs.current[0].position.set(birdPos.x, birdPos.y, 0);

    // pipes
    gameModel.current.state.pipesPositions.forEach((pipePos, index) => {
      pipeGroupRefs.current[index].position.set(pipePos.x, pipePos.y, 0);
    });
  });

  // For future reference: We can manage an array of player components with an array in a ref:
  // const arrayRef = useRef([]);
  // And then we can refer to it in the mesh like this:
  // ... meshRef={ el => arrayRef.current[index] = el } ...
  // This actually works?!?!
  return (
    <>
      <GameVisor
        score={score}
        runState={runState}
      />

      <Bird meshRef={el => (birdMeshRefs.current[0] = el)} />
      {gameModel.current.state.pipesPositions.map((el, index) => (
        <Pipe
          key={index}
          groupRef={el => (pipeGroupRefs.current[index] = el)}
        />
      ))}
      <BackgroundPanel />
    </>
  );
}

function BackgroundPanel() {
  return (
    <mesh position={[0, 0, -0.1]}>
      <planeGeometry args={[8, 4.5, 1, 1]} />
      <meshBasicMaterial
        // wireframe
        color={'skyblue'}
      />
    </mesh>
  );
}
