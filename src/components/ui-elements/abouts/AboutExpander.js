import { useState } from 'react';
import { ReactComponent as MenuExpandSVG } from '../../../assets/icons/google-material-arrow-down-circle.svg';

export default function AboutExpander({ title, children }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <div className='about-container'>
      <div
        className={`about-header ${isOpen ? 'open' : ''}`}
        onClick={() => setOpen(isOpen => !isOpen)}
      >
        <h1>{title}</h1>
        <p>(Click to expand)</p>
        <MenuExpandSVG />
      </div>
      <div className={`about-content-container ${isOpen ? 'open' : ''}`}>
        <div className='about-content'>{children}</div>
      </div>
    </div>
  );
}
