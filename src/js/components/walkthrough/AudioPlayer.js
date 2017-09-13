import React, { Component } from 'react';
import classNames from 'classnames';

const icons = {
  play: (
    <svg
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
  ),
  pause: (
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
  ),
  loading: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="6" y2="12" />
      <line x1="18" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
    </svg>
  )
};

export default class AudioPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.progressTask = this.progressTask.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.playing && nextProps.playing) {
      this.progressTask();
    } else if (this.props.playing && !nextProps.playing) {
      this.stopProgressTask();
    }
  }

  componentWillUnmount() {
    this.stopProgressTask();
  }

  progressTask() {
    if (this.props.walkthrough) {
      const currentTime = this.props.walkthrough.getCurrentTime();
      const duration = this.props.walkthrough.getDuration();
      this.setState({ currentTime, duration });
    }
    this._progressTask = window.requestAnimationFrame(this.progressTask);
  }

  stopProgressTask() {
    if (this._progressTask) {
      window.cancelAnimationFrame(this._progressTask);
    }
  }

  render() {
    const { className, loading, onPlayPause, playing } = this.props;
    const { currentTime, duration } = this.state;

    let width = 0;
    if (currentTime != null && duration != null && duration > 0) {
      width = currentTime / duration * 100;
    }

    return (
      <div className={classNames('walkthrough-player', className, { loading })}>
        <button onClick={onPlayPause} className="walkthrough-player__btn">
          {loading ? icons.loading : playing ? icons.pause : icons.play}
        </button>
        <div className="walkthrough-player__progress">
          <div
            className="walkthrough-player__progress-bar"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    );
  }
}
