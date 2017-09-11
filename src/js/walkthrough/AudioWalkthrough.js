import WAAClock from 'waaclock';
import bufferLoader from '../utils/buffer-loader';

import Walkthrough from './Walkthrough';

export default class AudioWalkthrough extends Walkthrough {
  constructor(walkthrough) {
    super(walkthrough);

    this.highlight_ids = [];

    this.audioContext = new AudioContext();
    this.clock = new WAAClock(this.audioContext);
    this.events = [];

    this.bufferNode = null;
    this.buffer = null;
    this.audioStartTime = null;
    this.audioPauseTime = null;
    this.audioCurrentTime = 0;
  }

  onCreateHighlight(func) {
    this.handleCreateHighlight = func;
  }
  onRemoveHighlight(func) {
    this.handleRemoveHighlight = func;
  }
  onComplete(func) {
    this.handleComplete = func;
  }

  start() {
    // Load the Audio
    return bufferLoader(this.audioContext, this.walkthrough.audioUrl)
      .then(buffer => {
        this.buffer = buffer;

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
    this.highlight_ids.forEach(id => this.handleRemoveHighlight(id));

    this.walkthrough.steps.forEach((step, i) => {
      // TODO if step.type == highlight

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
    });

    this.bufferNode.connect(this.audioContext.destination);
    this.bufferNode.start(now, this.audioCurrentTime);
    this.audioStartTime = now;
  }

  createHighlight(step, start, end) {
    // Create highlights when step.time is reached
    this.events.push(
      this.clock.callbackAtTime(() => {
        const elements = document.querySelectorAll(step.element);
        [].forEach.call(elements, el => {
          const highlight = {
            id: this.generateHighlightId(),
            el,
            type: step.highlightType,
            duration: step.duration
          };
          this.highlight_ids.push(highlight.id);
          this.handleCreateHighlight(highlight);
        });
      }, start)
    );

    // Remove highlights when the step.duration is over
    this.events.push(
      this.clock.callbackAtTime(() => {
        this.highlight_ids.forEach(id => this.handleRemoveHighlight(id));
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

  cancelEvents() {
    this.events.forEach(event => event.clear());
  }

  ended() {
    this.bufferNode = null;
    this.clock.stop();
    if (typeof this.handleComplete == 'function') {
      this.handleComplete();
    }
  }

  stop() {
    this.pause(true);
    this.clock.stop();
  }
}
