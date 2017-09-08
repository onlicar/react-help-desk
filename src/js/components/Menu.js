import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Menu = ({ children, className, ...props }, context) => (
    <button
        onClick={context.onToggle}
        className={classNames('help-desk__menu', className)}
        {...props}
    >
        {children}
    </button>
);

Menu.contextTypes = { onToggle: PropTypes.func };

export default Menu;
