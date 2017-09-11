import React, { Component } from 'react';
import WAAClock from 'waaclock';
import Transition from 'react-transition-group/Transition';
import classNames from 'classnames';

import AudioWalkthrough from 'walkthrough/AudioWalkthrough';
import AudioPlayer from './AudioPlayer';
import Popover from './Popover';

export default class Walkthrough extends Component {
  constructor(props) {
    super(props);

    this.state = {
      highlights: [],
      index: 0,
      isRunning: false
    };

    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.playPause = this.playPause.bind(this);
  }

  // componentWillMount() {
  //   const { autoStart, completed } = this.props;

  //   const isCompleted = completed && completed.indexOf(autoStart) == -1;
  //   if (autoStart && (!completed || isCompleted)) {
  //     window.setTimeout(() => this.runWalkthrough(autoStart), 10000);
  //   }
  // }

  componentWillMount() {
    const { walkthroughs } = this.props;

    if (typeof walkthroughs != 'undefined') {
      Object.keys(walkthroughs).forEach(name => {
        const walkthrough = walkthroughs[name];

        const url = walkthrough.trigger.url;
        if (url && url != window.location.pathname) {
          return;
        }

        const run = () => this.runWalkthrough(name);

        switch (walkthrough.trigger.type) {
          case 'auto':
            if (walkthrough.trigger.delay) {
              window.setTimeout(run, walkthrough.trigger.delay);
            } else {
              run();
            }
            break;
          case 'popover':
            this.setState({ popover: true, popoverName: name });
            break;
        }
      });
    }
  }

  runWalkthrough(name) {
    // TODO: Allow selection of which type of walkthrough to run from popover

    const walkthrough = this.props.walkthroughs[name];
    if (typeof walkthrough != 'undefined') {
      if (walkthrough.type == 'audio') {
        // Create new audio walkthrough
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
      } else {
        // Create text-based walkthrough
      }

      this.walkthrough.onComplete(() => this.setState({ isRunning: false }));

      this.setState({ isRunning: name }, () => this.walkthrough.start());
    }
  }

  handlePopoverClick() {
    const popoverName = this.state.popoverName;
    this.setState({ popover: false }, () => {
      this.runWalkthrough(popoverName);
    });
  }

  closePopover() {
    this.setState({ popoverName: null });
  }

  playPause() {
    if (this.state.isRunning) {
      const walkthrough = this.props.walkthroughs[this.state.isRunning];
      if (walkthrough.type == 'audio') {
        const audioPlaying = this.walkthrough.playPause();
        this.setState({ audioPlaying });
      }
    }
  }

  render() {
    const { walkthroughs } = this.props;
    const { audio, highlights, isRunning, popover, popoverName } = this.state;

    const popoverWalkthrough = popoverName ? walkthroughs[popoverName] : null;
    const activeWalkthrough = isRunning ? walkthroughs[isRunning] : null;

    return (
      <div
        className={classNames('walkthrough-wrapper', {
          'walkthrough-wrapper__active': isRunning || popover
        })}
      >
        {highlights.map((highlight, i) => {
          const offset = highlight.el.getBoundingClientRect();

          return (
            <div
              className={classNames(
                'walkthough__highlight',
                `walkthrough__highlight--${highlight.type}`
              )}
              style={{
                top: offset.top,
                left: offset.left,
                width: offset.width,
                height: offset.height
              }}
              key={i + '-' + highlight.id}
            />
          );
        })}
        <Transition
          in={popover}
          timeout={400}
          appear={true}
          onExited={this.closePopover}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          {state => (
            <Popover
              onClick={this.handlePopoverClick}
              walkthrough={popoverWalkthrough}
              className={state}
            />
          )}
        </Transition>
        <Transition
          in={activeWalkthrough && activeWalkthrough.type == 'audio'}
          timeout={200}
          appear={true}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          {state => (
            <AudioPlayer onPlayPause={this.playPause} className={state} />
          )}
        </Transition>
      </div>
    );
  }
}
