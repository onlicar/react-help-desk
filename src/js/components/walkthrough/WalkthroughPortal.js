import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import classNames from 'classnames';

import AudioWalkthrough from 'walkthrough/AudioWalkthrough';
import AudioPlayer from './AudioPlayer';
import Popover from './Popover';
import Underline from './highlights/Underline';
import Solo from './highlights/Solo';
import HighlightClass from './highlights/HighlightClass';

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
      highlights: [],
      index: 0,
      isRunning: false
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handlePopoverClick = this.handlePopoverClick.bind(this);
    this.requestClosePopover = this.requestClosePopover.bind(this);
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
    // Update the position of highlights
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

  runWalkthrough(name) {
    this.attachScrollListener();

    const { options } = this.props;
    // TODO: Allow selection of which type of walkthrough to run from popover

    const walkthrough = this.props.walkthroughs[name];
    if (typeof walkthrough != 'undefined') {
      if (walkthrough.type == 'audio') {
        // Create new audio walkthrough
        this.walkthrough = new AudioWalkthrough(walkthrough, options);
        this.setState({ loading: true });
        this.walkthrough.onStart(() => {
          this.setState({ audioPlaying: true, loading: false });
        });
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

      this.walkthrough.onComplete(() => {
        this.detachScrollListener();
        this.setState({ audioPlaying: false, isRunning: false });
      });

      this.setState({ isRunning: name }, () => this.walkthrough.start());
    }
  }

  handlePopoverClick() {
    const popoverName = this.state.popoverName;
    this.requestClosePopover(() => {
      this.runWalkthrough(popoverName);
    });
  }

  requestClosePopover(cb) {
    if (this.props.onWalkthroughIgnore) {
      this.props.onWalkthroughIgnore(this.state.popoverName);
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

  render() {
    const { walkthroughs } = this.props;
    const {
      audioPlaying,
      highlights,
      loading,
      isRunning,
      popover,
      popoverName
    } = this.state;

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

          switch (highlight.type) {
            case 'className':
              return (
                <HighlightClass
                  highlight={highlight}
                  key={i + '-' + highlight.id}
                />
              );
            case 'underline':
              return (
                <Underline
                  highlight={highlight}
                  offset={offset}
                  key={i + '-' + highlight.id}
                />
              );
            case 'solo':
              return <Solo offset={offset} key={i + '-' + highlight.id} />;
            default:
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
              onClose={() => this.requestClosePopover()}
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
