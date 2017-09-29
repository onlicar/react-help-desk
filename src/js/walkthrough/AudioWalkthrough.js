import WAAClock from 'waaclock';

import bufferLoader from '../utils/buffer-loader';
import isElementInViewport from '../utils/element-viewport';
import Walkthrough from './Walkthrough';

export default class AudioWalkthrough extends Walkthrough {
  constructor(walkthrough, options) {
    super(walkthrough, options);

    this.highlight_ids = [];

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContext();
    this.clock = new WAAClock(this.audioContext);
    this.events = [];

    this.loading = false;
    this.playing = false;
    this.bufferNode = null;
    this.buffer = null;
    this.audioStartTime = null;
    this.audioPauseTime = null;
    this.audioCurrentTime = 0;
  }

  onStart(func) {
    this.handleStart = func;
  }

  start() {
    // Load the Audio
    this.loading = true;
    return bufferLoader(this.audioContext, this.walkthrough.audioUrl)
      .then(buffer => {
        this.buffer = buffer;
        this.loading = false;

        if (this.handleStart) {
          this.handleStart();
        }

        this.play();
      })
      .catch(err => {
        console.error('Failed to load audio for walkthrough.');
        console.error(err);
      });
  }

  play() {
    if (this.playing) {
      return;
    }
    this.playing = true;
    const now = this.audioContext.currentTime;

    // Recreate buffer source
    if (this.bufferNode) {
      this.bufferNode.disconnect();
    }

    this.bufferNode = this.audioContext.createBufferSource();
    this.bufferNode.buffer = this.buffer;
    this.bufferNode.onended = this.ended.bind(this);
    this.clock.start();

    // Clear any existing highlights
    this.highlight_ids.forEach(id => this.handleRemove(id));

    this.walkthrough.steps.forEach((step, i) => {
      switch (step.type) {
        case 'url':
          const start = now - this.audioCurrentTime + step.time / 1000;
          this.events.push(
            this.clock.callbackAtTime(() => {
              this.options.history.push(step.url);
            }, start)
          );
          break;
        default:
          const stepLength = (step.time + step.duration) / 1000;
          const end = now - this.audioCurrentTime + stepLength;
          const currTime = this.audioCurrentTime;
          if (step.time / 1000 < currTime && stepLength > currTime) {
            // Create highlights if we paused in the middle of one
            this.createHighlight(step, now, end);
          } else {
            // Schedule a highlight to start
            const start = now - this.audioCurrentTime + step.time / 1000;
            this.createHighlight(step, start, end);
          }
          break;
      }
    });

    this.bufferNode.connect(this.audioContext.destination);
    this.bufferNode.start(now, this.audioCurrentTime);
    this.audioStartTime = now;
  }

  createHighlight(step, start, end) {
    // Check if element is in view 500ms before step.time
    this.events.push(
      this.clock.callbackAtTime(() => {
        const elements = document.querySelectorAll(step.element);
        // Check if the first element is in view, if not, scroll to it
        const outsideViewport = !isElementInViewport(elements[0]);
        if (elements.length && outsideViewport) {
          this.scrollTo(elements[0]);
        }
      }, start - 0.5)
    );

    // Create highlights when step.time is reached
    this.events.push(
      this.clock.callbackAtTime(() => {
        const elements = document.querySelectorAll(step.element);
        [].forEach.call(elements, el => {
          const highlight = {
            id: this.generateHighlightId(),
            el,
            type: step.highlightType,
            size: step.highlightSize,
            duration: step.duration
          };
          this.highlight_ids.push(highlight.id);
          this.handleCreate(highlight);
        });
      }, start)
    );

    // Remove highlights when the step.duration is over
    this.events.push(
      this.clock.callbackAtTime(() => {
        this.highlight_ids.forEach(id => this.handleRemove(id));
      }, end)
    );
  }

  pause(end = false) {
    if (!this.playing) {
      return;
    }
    this.playing = false;
    if (!end) {
      // Don't let the "end" event get triggered on manual pause.
      this.bufferNode.onended = null;
    }
    this.cancelEvents();

    const now = this.audioContext.currentTime;

    this.bufferNode.stop(now);

    this.audioPauseTime = now;
    this.audioCurrentTime += this.audioPauseTime - this.audioStartTime;
  }

  playPause() {
    if (!this.playing) {
      this.play();
      return true;
    } else {
      this.pause();
      return false;
    }
  }

  getCurrentTime() {
    if (this.playing) {
      return (
        this.audioContext.currentTime -
        this.audioStartTime +
        this.audioCurrentTime
      );
    }

    return this.audioCurrentTime;
  }

  getDuration() {
    if (this.buffer) {
      return this.buffer.duration;
    }

    return 0;
  }

  cancelEvents() {
    this.events.forEach(event => event.clear());
  }

  ended() {
    this.buffer = null;
    this.bufferNode = null;
    this.clock.stop();
    this.handleComplete(true);
  }

  skip() {
    this.pause(true);
    this.clock.stop();
    this.buffer = null;
    this.bufferNode = null;

    super.skip();
  }
}
