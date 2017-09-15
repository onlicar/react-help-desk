import React from 'react';
import classNames from 'classnames';

const Solo = ({ offset }) => {
  const top = offset.top - 1;
  const left = offset.left - 1;
  const right = offset.right + 1;
  const bottom = window.innerHeight - offset.bottom + 1;

  return (
    <div
      className={classNames(
        'walkthough__highlight',
        `walkthrough__highlight--solo`
      )}
    >
      <div
        className="solo-darken"
        style={{ top: 0, left: 0, bottom: 0, width: left }}
      />
      <div
        className="solo-darken"
        style={{ top: 0, left: right, bottom: 0, right: 0 }}
      />
      <div
        className="solo-darken"
        style={{ top: 0, left, width: offset.width + 2, height: top }}
      />
      <div
        className="solo-darken"
        style={{ left, bottom: 0, width: offset.width + 2, height: bottom }}
      />
    </div>
  );
};

export default Solo;
