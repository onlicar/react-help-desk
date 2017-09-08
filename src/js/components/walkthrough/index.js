import React, { Component } from 'react';
import WAAClock from 'waaclock';
import classNames from 'classnames';

import AudioWalkthrough from 'walkthroughs/AudioWalkthrough';

export default class Walkthrough extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlights: [],
      index: 0,
      isRunning: false
    };
  }

  componentWillMount() {
    const { autoStart, completed } = this.props;

    const isCompleted = completed && completed.indexOf(autoStart) == -1;
    if (autoStart && (!completed || isCompleted)) {
      window.setTimeout(() => this.runWalkthrough(autoStart), 10000);
    }
  }

  runWalkthrough(name) {
    const walkthrough = this.props.walkthroughs[name];
    if (typeof walkthrough != 'undefined') {
      if (walkthrough.type == 'audio') {
        this.walkthrough = new AudioWalkthrough(walkthrough);
        this.walkthrough.onCreateHighlight(highlight => {
          this.setState({
            highlights: [...this.state.highlights, highlight]
          });
        });
        this.walkthrough.onRemoveHighlight(id => {
          this.setState({
            highlights: this.state.highlights.filter(h => h.id != id)
          });
        });
        this.walkthrough.start();
      } else {
        // Create text-based walkthrough
      }
    }
  }

  render() {
    const { highlights } = this.state;

    return (
      <div className="walkthrough-wrapper">
        {highlights.map((highlight, i) => {
          const offset = highlight.el.getBoundingClientRect();
          const width = highlight.el.offsetWidth;
          const height = highlight.el.offsetHeight;

          console.log(highlight.el, offset, width, height);

          return (
            <div
              className={classNames(
                'walkthough__highlight',
                `walkthrough__highlight--${highlight.type}`
              )}
              style={{
                top: offset.top,
                left: offset.left,
                width,
                height
              }}
              key={i}
            />
          );
        })}
      </div>
    );
  }
}
