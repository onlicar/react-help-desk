import Walkthrough from './Walkthrough';

export default class TextWalkthrough extends Walkthrough {
  constructor(walkthrough, options) {
    super(walkthrough, options);

    this.modal_ids = [];
  }

  start() {
    this.goToStep(0);
  }

  goToStep(stepIndex) {
    this.handleRemove(this.modal_ids);
    this.modal_ids = [];

    if (stepIndex + 1 > this.walkthrough.steps.length) {
      this.handleComplete();
    } else {
      const step = this.walkthrough.steps[stepIndex];
      const el = document.querySelector(step.element);

      const modal = {
        id: this.generateHighlightId(),
        type: 'text',
        el,
        title: step.title,
        body: step.body,
        place: step.place || 'right'
      };
      this.modal_ids.push(modal.id);
      window.setTimeout(() => this.handleCreate(modal), 10);
    }
  }
}
