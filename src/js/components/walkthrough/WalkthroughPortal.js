import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import classNames from 'classnames';

import AudioWalkthrough from '../../walkthrough/AudioWalkthrough';
import TextWalkthrough from '../../walkthrough/TextWalkthrough';
import AudioPlayer from './AudioPlayer';
import Popover from './Popover';
import Underline from './highlights/Underline';
import Solo from './highlights/Solo';
import HighlightClass from './highlights/HighlightClass';
import TextModal from './highlights/TextModal';

const getParentElement = props => {
  let parent = props.parentSelector();
  if (parent == document.body) {
    parent = document;
  }

  return parent;
};

export default class WalkthroughPortal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      graphics: [],
      index: 0,
      isRunning: false
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.requestClosePopover = this.requestClosePopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.playPause = this.playPause.bind(this);
    this.nextStep = this.nextStep.bind(this);
    this.prevStep = this.prevStep.bind(this);
    this.skip = this.skip.bind(this);
  }

  // componentWillMount() {
  //   const { autoStart, completed } = this.props;

  //   const isCompleted = completed && completed.indexOf(autoStart) == -1;
  //   if (autoStart && (!completed || isCompleted)) {
  //     window.setTimeout(() => this.runWalkthrough(autoStart), 10000);
  //   }
  // }

  componentWillMount() {
    const { completed, ignored, walkthroughs } = this.props;

    if (typeof walkthroughs != 'undefined') {
      Object.keys(walkthroughs).forEach(name => {
        const walkthrough = walkthroughs[name];

        // Ignore if we're not on the correct trigger URL
        const url = walkthrough.trigger.url;
        if (url && url != window.location.pathname) {
          return;
        }
        // Ignore if the walkthrough has already been completed or ignored
        if (completed.indexOf(name) > -1 || ignored.indexOf(name) > -1) {
          return;
        }

        let trigger;
        switch (walkthrough.trigger.type) {
          case 'auto':
            trigger = () => this.runWalkthrough(name);
            break;
          case 'popover':
            trigger = () => this.setState({ popover: true, popoverName: name });
            break;
        }

        if (walkthrough.trigger.delay) {
          window.setTimeout(trigger, walkthrough.trigger.delay);
        } else {
          trigger();
        }
      });
    }

    // Attach a method to the window to start a walkthrough
    window.helpDeskWalkthrough = {
      run: name => this.runWalkthrough(name)
    };
  }

  componentWillUnmount() {
    this.detachScrollListener();
    window.helpDeskWalkthrough = null;
  }

  handleScroll(e) {
    // Update the position of graphics
    this.setState({ scroll: e.timeStamp });
  }

  attachScrollListener() {
    const parent = getParentElement(this.props);
    parent.addEventListener('scroll', this.handleScroll);
  }

  detachScrollListener() {
    const parent = getParentElement(this.props);
    parent.removeEventListener('scroll', this.handleScroll);
  }

  runWalkthrough(name, type = null) {
    if (this.walkthrough) {
      this.walkthrough.skip();
    }

    this.attachScrollListener();

    const { options } = this.props;
    options.history = this.props.history;

    const walkthrough = this.props.walkthroughs[name];
    if (typeof walkthrough != 'undefined') {
      if (type == null) {
        if (Array.isArray(walkthrough.type)) {
          type = walkthrough.type[0];
        } else {
          type = walkthrough.type;
        }
      }

      if (type == 'audio') {
        // Create new audio walkthrough
        this.walkthrough = new AudioWalkthrough(walkthrough, options);
        this.setState({ loading: true });
        this.walkthrough.onStart(() => {
          this.setState({ audioPlaying: true, loading: false });
        });
      } else {
        // Create text-based walkthrough
        this.walkthrough = new TextWalkthrough(walkthrough, options);
      }

      this.walkthrough.onCreate(item => {
        this.setState({
          graphics: [...this.state.graphics, item]
        });
      });
      this.walkthrough.onRemove(id => {
        this.setState({
          graphics: this.state.graphics.filter(
            g => (Array.isArray(id) ? id.indexOf(g.id) == -1 : g.id != id)
          )
        });
      });

      this.walkthrough.onComplete(completed => {
        this.detachScrollListener();
        this.setState(
          {
            audioPlaying: false,
            graphics: [],
            isRunning: false
          },
          () => {
            if (this.props.onComplete) {
              this.props.onComplete(name, completed);
            }
            this.walkthrough = null;
          }
        );
      });

      this.setState({ isRunning: name, popover: null, step: 0 }, () => {
        const url = walkthrough.trigger.url;
        if (url && url != window.location.pathname) {
          this.props.history.push(url);
          window.setTimeout(this.walkthrough.start, 500);
        } else {
          this.walkthrough.start();
        }
      });
    }
  }

  handlePopoverClick(type) {
    const popoverName = this.state.popoverName;
    this.requestClosePopover(false, () => {
      this.runWalkthrough(popoverName, type);
    });
  }

  requestClosePopover(ignored, cb) {
    if (ignored && this.props.onComplete) {
      this.props.onComplete(this.state.popoverName, false);
    }
    this.setState({ popover: false }, cb);
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

  nextStep(e) {
    if (e) {
      e.stopPropagation();
    }
    const step = this.state.step + 1;
    this.setState({ step }, () => {
      if (this.walkthrough && this.walkthrough.goToStep) {
        const result = this.walkthrough.goToStep(step);
        if (!result) {
          this.nextStep();
        }
      }
    });
  }

  prevStep(e) {
    if (e) {
      e.stopPropagation();
    }
    const step = this.state.step - 1;
    this.setState({ step }, () => {
      if (this.walkthrough && this.walkthrough.goToStep) {
        const result = this.walkthrough.goToStep(step);
        if (!result) {
          this.prevStep();
        }
      }
    });
  }

  skip() {
    if (this.walkthrough && this.walkthrough.skip) {
      this.walkthrough.skip();
    }
  }

  render() {
    const { history, walkthroughs } = this.props;
    const {
      audioPlaying,
      graphics,
      loading,
      isRunning,
      popover,
      popoverName,
      step
    } = this.state;

    const popoverWalkthrough = popoverName ? walkthroughs[popoverName] : null;
    const activeWalkthrough = isRunning ? walkthroughs[isRunning] : null;

    return (
      <div
        className={classNames('walkthrough-wrapper', {
          'walkthrough-wrapper__active': isRunning || popover
        })}
      >
        {graphics.map((graphic, i) => {
          let offset = null;
          if (graphic.el) {
            offset = graphic.el.getBoundingClientRect();
          }
          const key = i + '-' + graphic.id;

          switch (graphic.type) {
            case 'className':
              return <HighlightClass highlight={graphic} key={key} />;
            case 'underline':
              return (
                <Underline highlight={graphic} offset={offset} key={key} />
              );
            case 'solo':
              return <Solo offset={offset} key={key} />;
            case 'text':
              graphic.index = step;
              return (
                <TextModal
                  step={graphic}
                  totalSteps={
                    activeWalkthrough && activeWalkthrough.steps.length
                  }
                  offset={offset}
                  onNext={this.nextStep}
                  onPrev={this.prevStep}
                  onSkip={this.skip}
                  key={key}
                />
              );
            default:
              return (
                <div
                  className={classNames(
                    'walkthough__highlight',
                    `walkthrough__highlight--${graphic.type}`
                  )}
                  style={{
                    top: offset.top,
                    left: offset.left,
                    width: offset.width,
                    height: offset.height
                  }}
                  key={key}
                />
              );
          }
        })}
        <Transition
          in={!isRunning && popover}
          timeout={400}
          appear={true}
          onExited={this.closePopover}
          mountOnEnter={true}
          unmountOnExit={true}
        >
          {state => (
            <Popover
              onClick={this.handlePopoverClick}
              onClose={() => this.requestClosePopover(true)}
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
            <AudioPlayer
              walkthrough={this.walkthrough}
              playing={audioPlaying}
              loading={loading}
              onPlayPause={this.playPause}
              className={state}
            />
          )}
        </Transition>
      </div>
    );
  }
}
