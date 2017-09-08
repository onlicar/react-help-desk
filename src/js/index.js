import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import Content from './Content';
import Header from './Header';
import Menu from './Menu';
import Widgets from './Widgets';
import Widget from './Widget';

class HelpDesk extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            activeTab: props.defaultTab,
            expanded: props.defaultExpanded
        };

        this.handleSelectTab = this.handleSelectTab.bind(this);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    getChildContext() {
        // Use internal functions if component is not being controlled
        let onClose = this.onClose;
        let onToggle = this.toggleExpand;
        if(typeof this.props.expanded != 'undefined') {
            onClose = this.props.onClose;
            onToggle = this.props.onToggle;
        }

        return {
            activeTab: this.state.activeTab,
            defaultTab: this.props.defaultTab,
            onClose,
            onToggle,
            onSelectTab: this.handleSelectTab
        };
    }

    toggleExpand() {
        this.setState({ expanded: !this.state.expanded });
    }

    onClose() {
        this.setState({ expanded: false });
    }

    handleSelectTab(tab, e) {
        this.setState({ activeTab: tab });
    }

    render() {
        const { children, expanded, placement } = this.props;
        const isExpanded = typeof this.props.expanded != 'undefined'
            ? this.props.expanded
            : this.state.expanded;

        return (
            <div
                className={classNames('help-desk', {
                    [`help-desk-${placement}`]: placement,
                    'help-desk--expanded': isExpanded
                })}
            >
                {children}
            </div>
        );
    }
}

HelpDesk.propTypes = { defaultTab: PropTypes.string.isRequired };

HelpDesk.childContextTypes = {
    activeTab: PropTypes.string,
    defaultTab: PropTypes.string,
    onClose: PropTypes.func,
    onToggle: PropTypes.func,
    onSelectTab: PropTypes.func
};

HelpDesk.Content = Content;
HelpDesk.Header = Header;
HelpDesk.Menu = Menu;
HelpDesk.Widgets = Widgets;
HelpDesk.Widget = Widget;

export default HelpDesk;
