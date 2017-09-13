import React, { Component } from 'react';
import classNames from 'classnames';

import ThumbRating from './ThumbRating';

export default class Article extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentWillUnmount() {
    if (this._closeTask) {
      window.clearTimeout(this._closeTask);
    }
  }

  handleRating(rating) {
    this.props.onArticleRating(rating === 'up');
    this.setState({ selected: rating });
    this._closeTask = window.setTimeout(() => {
      this.props.onClose();
    }, 800);
  }

  render() {
    const { article, className, onArticleRating } = this.props;
    const { selected } = this.state;

    return (
      <div className={classNames('help-desk__article', className)}>
        <h4>{article.title}</h4>
        <p dangerouslySetInnerHTML={{ __html: article.body }} />
        {typeof onArticleRating == 'function' && (
          <div
            className={classNames('help-desk__thumb-ratings', {
              selected: !!selected
            })}
          >
            {selected && <p className="help-desk__thanks">Thanks!</p>}
            <ThumbRating
              type="up"
              onClick={this.handleRating.bind(this)}
              selected={selected}
            />
            <ThumbRating
              type="down"
              onClick={this.handleRating.bind(this)}
              selected={selected}
            />
          </div>
        )}
      </div>
    );
  }
}
