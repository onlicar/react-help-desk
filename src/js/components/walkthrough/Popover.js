import React from 'react';
import classNames from 'classnames';

const icons = {
  text: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  ),
  audio: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
};

const Popover = ({ className, onClose, onClick, walkthrough }) => {
  const types =
    typeof walkthrough.type == 'string' ? [walkthrough.type] : walkthrough.type;

  const typeTexts = { audio: 'Sound walkthrough', text: 'Text bubbles' };

  return (
    <div className={classNames('walkthrough-popover', className)}>
      <h1 className="walkthrough-popover__title">{walkthrough.title}</h1>
      <div className="walkthrough-popover__options">
        {types.map((type, i) => (
          <button
            onClick={() => onClick(type)}
            className="walkthrough-popover__option"
            key={i}
          >
            {icons[type]}
            <span className="walkthough-popover__type">{typeTexts[type]}</span>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="walkthrough-popover__close">
        <svg viewBox="0 0 60 60" fill="currentColor">
          <path d="M35.7,30L58.8,6.8C59.6,6.1,60,5.1,60,4c0-2.2-1.8-4-4-4c-1.1,0-2.1,0.4-2.8,1.2L30,24.3L6.8,1.2C6.1,0.4,5.1,0,4,0C1.8,0,0,1.8,0,4c0,1.1,0.4,2.1,1.2,2.8L24.3,30L1.2,53.2C0.4,53.9,0,54.9,0,56c0,2.2,1.8,4,4,4c1.1,0,2.1-0.4,2.8-1.2L30,35.7l23.2,23.2c0.7,0.7,1.7,1.2,2.8,1.2c2.2,0,4-1.8,4-4c0-1.1-0.4-2.1-1.2-2.8L35.7,30z" />
        </svg>
      </button>
    </div>
  );
};

export default Popover;
