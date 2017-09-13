import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Content = ({ children, className, ...props }, context) => {
  // Show the top level tab i.e. faq if the active tab is faq.article
  let activeTab = context.activeTab;
  if (activeTab.indexOf('.') > 0) {
    activeTab = activeTab.slice(0, activeTab.indexOf('.'));
  }

  return (
    <div className={classNames('help-desk__content', className)} {...props}>
      {React.Children.map(children, tab => {
        if (tab.props.name == activeTab) {
          return tab;
        }
      })}
    </div>
  );
};

Content.contextTypes = { activeTab: PropTypes.string };

export default Content;
