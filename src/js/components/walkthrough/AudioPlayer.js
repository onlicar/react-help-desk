import React from 'react';
import classNames from 'classnames';

const AudioPlayer = ({ className, onPlayPause }) => (
  <div className={classNames('walkthrough-player', className)}>
    <div className="walkthrough-player__wrapper">
      <button onClick={onPlayPause} className="walkthrough-player__btn">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="4" width="4" height="16" />
          <rect x="14" y="4" width="4" height="16" />
        </svg>
      </button>
    </div>
  </div>
);

export default AudioPlayer;
