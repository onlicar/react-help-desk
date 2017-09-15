import React, { Component } from 'react';

export default class HighlightClass extends Component {
  componentWillMount() {
    const hl = this.props.highlight;
    if (hl.el) {
      hl.el.classList.add('walkthrough-highlighted', hl.className);
    }
  }

  componentWillUnmount() {
    const hl = this.props.highlight;
    if (hl.el) {
      hl.el.classList.remove('walkthrough-highlighted', hl.className);
    }
  }

  render() {
    return null;
  }
}
