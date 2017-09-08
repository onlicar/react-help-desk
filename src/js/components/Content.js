import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Content = ({ children, className, ...props }, context) => (
  <div className={classNames('help-desk__content', className)} {...props}>
    {React.Children.map(children, tab => {
      if (tab.props.name == context.activeTab) {
        return tab;
      }
    })}
  </div>
);

Content.contextTypes = { activeTab: PropTypes.string };

export default Content;
