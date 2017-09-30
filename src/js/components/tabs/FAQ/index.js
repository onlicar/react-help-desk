import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import slugify from 'slugify';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Article from './Article';
import Category from './Category';

export default class FAQ extends Component {
  static contextTypes = {
    activeTab: PropTypes.string,
    onSelectTab: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { searchValue: '' };

    this.handleSearch = this.handleSearch.bind(this);
    this.goToArticle = this.goToArticle.bind(this);
    this.closeArticle = this.closeArticle.bind(this);
    this.handleArticleExit = this.handleArticleExit.bind(this);
  }

  componentDidUpdate() {
    if (this.context.activeTab.indexOf('.') == -1 && this.state.showArticle) {
      this.setState({ showArticle: false });
    }
  }

  handleSearch(e) {
    this.setState({ searchValue: e.target.value, showArticle: false });
  }

  goToArticle(article, e) {
    if (e) {
      e.preventDefault();
    }
    const title = slugify(article.title).toLowerCase();
    this.context.onSelectTab(`${this.context.activeTab}.${title}`);
    this.setState({ showArticle: true, singleArticle: article });
  }

  closeArticle() {
    let faqTab = this.context.activeTab;
    faqTab = faqTab.slice(0, faqTab.indexOf('.'));
    this.context.onSelectTab(faqTab);
  }

  handleArticleExit() {
    this.setState({ singleArticle: null });
  }

  render() {
    const {
      json,
      onArticleRating,
      search = true,
      searchLabel = 'Search for articles',
      noResultsText = 'No FAQ articles found 🔍😱'
    } = this.props;
    const { searchValue, showArticle, singleArticle } = this.state;

    // The FAQ Homepage can show a list of all articles
    // if it's simple or a list of categories
    let articles = json.articles || [];
    const categories = json.categories || [];

    if (search) {
      const searchFilter = searchValue.toLowerCase();
      if (searchFilter.length > 0) {
        let allArticles = [];
        const findArticles = category => {
          if (category.articles) {
            allArticles = allArticles.concat(category.articles);
          }
          if (category.categories) {
            category.categories.forEach(findArticles);
          }
        };
        categories.forEach(findArticles);

        articles = allArticles.filter(
          a =>
            a.title.toLowerCase().indexOf(searchFilter) > -1 ||
            a.body.toLowerCase().indexOf(searchFilter) > -1
        );
      }
    }

    return (
      <div className="help-desk__faq">
        {search && (
          <div className="help-desk__search">
            <label htmlFor="help-desk__faq-search" className="help-desk__label">
              {searchLabel}
            </label>
            <input
              type="text"
              id="help-desk__faq-search"
              onChange={this.handleSearch}
              className="help-desk__input"
              value={searchValue}
              placeholder={searchLabel}
              aria-describedby="help-desk__faq-search"
            />
          </div>
        )}
        <div
          className={classNames('help-desk__faq-content', {
            scrollable: !showArticle
          })}
        >
          {searchValue.length == 0 && categories ? (
            categories.map((category, i) => (
              <Category
                category={category}
                goToArticle={this.goToArticle}
                key={i}
              />
            ))
          ) : articles.length > 0 ? (
            articles.map((article, i) => (
              <a
                href="#"
                onClick={e => this.goToArticle(article, e)}
                className="help-desk__article-title"
                key={i}
              >
                {article.title}
              </a>
            ))
          ) : (
            <p className="help-desk__empty-state">{noResultsText}</p>
          )}
          <Transition
            in={showArticle}
            timeout={200}
            appear={true}
            onExited={this.handleArticleExit}
            mountOnEnter={true}
            unmountOnExit={true}
          >
            {state => (
              <Article
                article={singleArticle}
                onClose={this.closeArticle}
                onArticleRating={onArticleRating}
                className={state}
              />
            )}
          </Transition>
        </div>
      </div>
    );
  }
}
