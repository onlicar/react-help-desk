import WAAClock from 'waaclock';
import bufferLoader from '../utils/buffer-loader';

import Walkthrough from './Walkthrough';

export default class AudioWalkthrough extends Walkthrough {
  constructor(walkthrough) {
    super(walkthrough);

    this.audioContext = new AudioContext();
    this.clock = new WAAClock(this.audioContext);
    this.events = [];
  }

  onCreateHighlight(func) {
    this.handleCreateHighlight = func;
  }
  onRemoveHighlight(func) {
    this.handleRemoveHighlight = func;
  }

  start() {
    // Load the Audio
    return bufferLoader(this.audioContext, this.walkthrough.audioUrl)
      .then(buffer => {
        this.bufferNode = this.audioContext.createBufferSource();
        this.bufferNode.buffer = buffer;

        this.startTime = this.audioContext.currentTime;
        this.clock.start();

        this.walkthrough.steps.forEach((step, i) => {
          // TODO if step.type == highlight
          const highlight_ids = [];
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
                highlight_ids.push(highlight.id);
                this.handleCreateHighlight(highlight);
              });
            }, this.startTime + step.time / 1000)
          );

          // Remove highlights when the step.duration is over
          this.events.push(
            this.clock.callbackAtTime(() => {
              highlight_ids.forEach(id => this.handleRemoveHighlight(id));
            }, this.startTime + (step.time + step.duration) / 1000)
          );
        });

        // Schedule the clock to finish after steps completed
        const lastStep = this.walkthrough.steps[
          this.walkthrough.steps.length - 1
        ];
        this.events.push(
          this.clock.callbackAtTime(() => {
            this.clock.stop();
          }, this.startTime + lastStep.time + lastStep.duration + 1)
        );

        this.bufferNode.connect(this.audioContext.destination);
        this.bufferNode.start();
      })
      .catch(err => {
        console.error('Failed to load audio for walkthrough.');
        console.error(err);
      });
  }

  stop() {
    this.events.forEach(event => event.clear());
    this.clock.stop();
  }
}
