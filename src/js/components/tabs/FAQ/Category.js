import React, { Component } from 'react';
import classNames from 'classnames';

export default class Category extends Component {
  constructor(props) {
    super(props);

    this.state = { expanded: props.expanded };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  toggleExpand() {
    this.setState({ expanded: !this.state.expanded });
  }

  render() {
    const { category, goToArticle } = this.props;
    const { expanded } = this.state;

    return (
      <div className={classNames('help-desk__category', { expanded })}>
        <a
          href="#"
          className="help-desk__category-title"
          onClick={this.toggleExpand}
        >
          {expanded ? (
            <svg viewBox="0 0 5 1">
              <rect x="0" y="0" width="5" height="1" />
            </svg>
          ) : (
            <svg viewBox="49 529 5 5">
              <path d="M51,531 L49,531 L49,532 L51,532 L51,534 L52,534 L52,532 L54,532 L54,531 L52,531 L52,529 L51,529 L51,531 Z" />
            </svg>
          )}
          {category.title}
        </a>
        <div className="help-desk__faq-items">
          {category.categories &&
            category.categories.map((cat, i) => (
              <Category category={cat} key={i} />
            ))}
          {category.articles &&
            category.articles.map((article, i) => (
              <a
                href="#"
                onClick={() => goToArticle(article)}
                className="help-desk__article-title"
                key={i}
              >
                {article.title}
              </a>
            ))}
        </div>
      </div>
    );
  }
}
