import React from 'react';
import PropTypes from 'prop-types';

const Widget = ({
    externalAction,
    children,
    label,
    onClick,
    onSelectTab,
    tab
}, context) => {
    const handleClick = e => {
        if(tab) {
            return context.onSelectTab(tab, e);
        }
        if(typeof externalAction != 'undefined' && externalAction != false) {
            context.onClose();
        }
        
        onClick(e);
    };
    
    return (
        <button className="help-desk__widget" onClick={handleClick}>
            <div className="box">{children}</div>
            <p>{label}</p>
        </button>
    );
};

Widget.contextTypes = { onClose: PropTypes.func, onSelectTab: PropTypes.func };

export default Widget;
