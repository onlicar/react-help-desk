import React, { Component } from 'react';
import Vivus from 'vivus';
import classNames from 'classnames';

const svgs = {
  sm: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 91.901 12.557"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M5 5s15.9 3 35.9 2.5 46-1.222 46-1.222"
      />
    </svg>
  ),
  md: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 245.488 15.25"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M5,10.25C5,10.25,58.997,5,88.996,5s136.494,0,151.493,5.25"
      />
    </svg>
  ),
  lg: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 383.401 19.448"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M5 5s59.4 13.002 200.4 8.5 173 .948 173 .948"
      />
    </svg>
  ),
  lg_curve: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 352 28.038"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M5 23.038s25-19 81-18c0 0 237 6.962 261 8.98"
      />
    </svg>
  ),
  lg_circle: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 310.537 74.819"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M174.082 7.004s-138.052-14-166.052 32 147.26 26.873 147.26 26.873 160.38-6.073 149.74-38.873c-5.84-18-84.568-11.27-84.568-11.27"
      />
    </svg>
  ),
  circle: (ref, id) => (
    <svg
      ref={ref}
      id={id}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 145.146 132"
    >
      <path
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="10"
        d="M55.015 5s-51 18-50 67 51.63 55 62.63 55c24.298 0 87.177-10 69.37-70s-51-46-51-46"
      />
    </svg>
  )
};

// TODO: See if offset can be put into style prop directly
export default class Underline extends Component {
  componentDidMount() {
    if (this._svg) {
      // 36/60 = 0.6 seconds
      new Vivus('svg' + this.props.highlight.id, { duration: 36 });
    }
  }

  render() {
    const { highlight, offset } = this.props;

    const svg = svgs[highlight.size || 'sm'];

    return (
      <div
        className={classNames(
          'walkthough__highlight',
          `walkthrough__highlight--underline`
        )}
        style={{
          top:
            highlight.size.indexOf('circle') == -1
              ? offset.top + offset.height - 3
              : offset.top - 30,
          left:
            highlight.size.indexOf('circle') == -1
              ? offset.left - 10
              : offset.left - 30,
          width:
            highlight.size.indexOf('circle') == -1
              ? offset.width
              : offset.width + 60,
          height:
            highlight.size.indexOf('circle') == -1
              ? offset.height
              : offset.height + 60,
          stroke: highlight.color
        }}
      >
        {svg(c => (this._svg = c), 'svg' + highlight.id)}
      </div>
    );
  }
}
