import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import WalkthroughPortal from './WalkthroughPortal';

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;

export default class Walkthrough extends Component {
  static propTypes = { parentSelector: PropTypes.func };

  static defaultProps = { parentSelector: () => document.body };

  componentDidMount() {
    this.node = document.createElement('div');

    const parent = this.props.parentSelector();
    parent.appendChild(this.node);

    this.renderPortal(this.props);
  }

  componentWillReceiveProps(newProps) {
    const currentParent = this.props.parentSelector();
    const newParent = newProps.parentSelector();

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }

    this.renderPortal(newProps);
  }

  componentWillUnmount() {
    if (!this.node || !this.portal) {
      return;
    }

    ReactDOM.unmountComponentAtNode(this.node);
    const parent = this.props.parentSelector();
    parent.removeChild(this.node);
  }

  renderPortal(props) {
    this.portal = renderSubtreeIntoContainer(
      this,
      <WalkthroughPortal
        parentSelector={this.props.parentSelector}
        {...props}
      />,
      this.node
    );
  }

  render() {
    return null;
  }
}
