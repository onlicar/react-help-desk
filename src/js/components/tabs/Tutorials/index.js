import React from 'react';
import PropTypes from 'prop-types';

const Tutorials = (
  {
    helpText = 'Learn how to use the app by playing an audio or text-based tutorial that will walk you through our system.',
    walkthroughs
  },
  context
) => {
  const start = name => {
    if (window.helpDeskWalkthrough) {
      context.onClose();
      window.helpDeskWalkthrough.run(name);
    } else {
      console.error('Walkthrough component not found.');
    }
  };

  return (
    <div className="help-desk__tutorials">
      {helpText && <p className="help-desk__tutorials-help">{helpText}</p>}
      {Object.keys(walkthroughs).map((name, i) => {
        const walkthrough = walkthroughs[name];
        let shortTitle = walkthrough.title;
        if (shortTitle.length > 43) {
          shortTitle = shortTitle.slice(0, 40) + '...';
        }

        return (
          <button
            onClick={() => start(name)}
            className="help-desk__tutorial"
            title={walkthrough.title}
            key={i}
          >
            <div className="help-desk__tutorial-thumbnail">
              <img src={walkthrough.thumbnail} />
              <svg
                className="help-desk__tutorial-play"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <p>{shortTitle}</p>
          </button>
        );
      })}
    </div>
  );
};

Tutorials.contextTypes = { onClose: PropTypes.func };

export default Tutorials;
