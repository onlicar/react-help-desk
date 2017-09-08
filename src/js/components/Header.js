import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Header = ({ className, title }, context) => (
    <header className={classNames('help-desk__header', className)}>
        <h1>{title}</h1>
        {context.defaultTab != context.activeTab && (
            <button
                onClick={e => context.onSelectTab(context.defaultTab)}
                className="help-desk__back"
            >
                <svg viewBox="0 0 34 60">
                    <path d="M1.2,32.8l26,26c0.7,0.7,1.7,1.2,2.8,1.2c2.2,0,4-1.8,4-4c0-1.1-0.4-2.1-1.2-2.8L9.7,30 L32.8,6.8C33.6,6.1,34,5.1,34,4c0-2.2-1.8-4-4-4c-1.1,0-2.1,0.4-2.8,1.2l-26,26C0.4,27.9,0,28.9,0,30C0,31.1,0.4,32.1,1.2,32.8z" />
                </svg>
            </button>
        )}
        <button onClick={context.onClose} className="help-desk__close">
            <svg viewBox="0 0 60 60">
                <path d="M35.7,30L58.8,6.8C59.6,6.1,60,5.1,60,4c0-2.2-1.8-4-4-4c-1.1,0-2.1,0.4-2.8,1.2L30,24.3L6.8,1.2C6.1,0.4,5.1,0,4,0C1.8,0,0,1.8,0,4c0,1.1,0.4,2.1,1.2,2.8L24.3,30L1.2,53.2C0.4,53.9,0,54.9,0,56c0,2.2,1.8,4,4,4c1.1,0,2.1-0.4,2.8-1.2L30,35.7l23.2,23.2c0.7,0.7,1.7,1.2,2.8,1.2c2.2,0,4-1.8,4-4c0-1.1-0.4-2.1-1.2-2.8L35.7,30z" />
            </svg>
        </button>
    </header>
);

Header.contextTypes = {
    activeTab: PropTypes.string,
    defaultTab: PropTypes.string,
    onClose: PropTypes.func,
    onSelectTab: PropTypes.func
};

export default Header;
