import React from 'react';
import Modal from 'react-modal';
import classNames from 'classnames';

const caret_offset = 15;

const TextModal = ({ offset, onNext, onPrev, onSkip, step, totalSteps }) => {
  const place = step.place;
  let modalOffset;

  if (offset) {
    // Calculate where to place the modal next to the element
    const middleVertical = offset.top + offset.height / 2;
    const middleHorizontal = offset.left + offset.width / 2;
    const translates = {
      top: [-50, -100],
      bottom: [-50, 0],
      left: [-100, -50],
      right: [0, -50]
    };

    modalOffset = {
      top:
        place == 'top'
          ? offset.top - caret_offset
          : place == 'bottom' ? offset.bottom + caret_offset : middleVertical,
      left:
        place == 'left'
          ? offset.left - caret_offset
          : place == 'right' ? offset.right + caret_offset : middleHorizontal,
      transform: `translate(${translates[place][0]}%, ${translates[place][1]}%)`
    };
  } else {
    // Display the modal in the middle of the screen
    modalOffset = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    };
  }

  return (
    <Modal
      isOpen={true}
      contentLabel={step.title}
      className={classNames('walkthrough__text-modal', {
        [`walkthrough__text-modal--${place}`]: place && offset
      })}
      overlayClassName="walkthrough__text-overlay"
      style={{ content: modalOffset }}
    >
      <div className="walkthrough__text-modal-content">
        {step.title && <h1>{step.title}</h1>}
        {step.body && <p dangerouslySetInnerHTML={{ __html: step.body }} />}
      </div>
      <div className="walkthrough__text-actions">
        <p>
          Step {step.index + 1} / {totalSteps}
        </p>
        {step.index > 0 && (
          <button
            onClick={onPrev}
            className="walkthrough__btn-step walkthrough__btn-prev"
          >
            Previous
          </button>
        )}
        {step.index + 1 <= totalSteps && (
          <button
            onClick={onNext}
            className="walkthrough__btn-step walkthrough__btn-next"
          >
            {step.index + 1 < totalSteps ? 'Next' : 'Finish'}
          </button>
        )}
      </div>
      <button onClick={onSkip} className="walkthrough__btn-close">
        <svg viewBox="0 0 60 60" fill="currentColor">
          <path d="M35.7,30L58.8,6.8C59.6,6.1,60,5.1,60,4c0-2.2-1.8-4-4-4c-1.1,0-2.1,0.4-2.8,1.2L30,24.3L6.8,1.2C6.1,0.4,5.1,0,4,0C1.8,0,0,1.8,0,4c0,1.1,0.4,2.1,1.2,2.8L24.3,30L1.2,53.2C0.4,53.9,0,54.9,0,56c0,2.2,1.8,4,4,4c1.1,0,2.1-0.4,2.8-1.2L30,35.7l23.2,23.2c0.7,0.7,1.7,1.2,2.8,1.2c2.2,0,4-1.8,4-4c0-1.1-0.4-2.1-1.2-2.8L35.7,30z" />
        </svg>
      </button>
    </Modal>
  );
};

export default TextModal;
