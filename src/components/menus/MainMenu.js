import React from 'react';
import { Link } from 'react-router-dom';

export default function MainMenu() {
  return (
    <>
      <div className='menu-title'>Learnin' Birds</div>
      <div className='menu-items'>
        <Link to='/humangame'>I want to play!</Link>
        <Link to='/aigame'>I want to watch the AI learn to play!</Link>
        <Link to='/settings'>Settings</Link>
      </div>
    </>
  );
}
