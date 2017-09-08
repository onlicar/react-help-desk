import React, { Component } from 'react';

import Category from './Category';

export default class FAQ extends Component {
    constructor(props) {
        super(props);

        this.state = { searchValue: '' };

        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch(e) {
        this.setState({ searchValue: e.target.value })
    }

    render() {
        const {
            json,
            search = true,
            searchLabel = 'Search for articles',
            noResultsText = 'No FAQ articles found 🔍😱'
        } = this.props;
        const { searchValue } = this.state;

        // The FAQ Homepage can show a list of all articles
        // if it's simple or a list of categories
        let articles = json.articles;
        const categories = json.categories;

        if(search) {
            const searchFilter = searchValue.toLowerCase();
            if(searchFilter.length > 0) {
                let allArticles = [];
                const findArticles = category => {
                    if(category.articles) {
                        allArticles = allArticles.concat(category.articles);
                    }
                    if(category.categories) {
                        category.categories.forEach(findArticles);
                    }
                };
                categories.forEach(findArticles);

                articles = allArticles.filter(a =>
                    a.title.toLowerCase().indexOf(searchFilter) > -1
                        || a.body.toLowerCase().indexOf(searchFilter) > -1
                );
            }
        }

        return (
            <div className="help-desk__faq">
                {search && (<div className="help-desk__search">
                    <label
                        htmlFor="help-desk__faq-search"
                        className="help-desk__label"
                    >
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
                </div>)}
                <div className="help-desk__faq-content">
                    {searchValue.length == 0 && categories ? categories.map((category, i) => (
                        <Category category={category} key={i} />
                    )) : articles.length > 0 ? articles.map((article, i) => (
                        <a className="article-title" key={i}>{article.title}</a>
                    )) : (
                        <p className="empty-state">{noResultsText}</p>
                    )}
                </div>
            </div>
        );
    }
}
