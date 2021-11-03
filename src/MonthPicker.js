import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { translate } from './translate';

import MonthInput from './MonthInput';
import MonthCalendar from './MonthCalendar';
import { DateTime } from 'luxon';

export default class MonthPicker extends Component {
    static propTypes = {
        value: PropTypes.shape({
            year: PropTypes.number.isRequired,
            month: PropTypes.number.isRequired,
        }),
        format: PropTypes.string,
        onChange: PropTypes.func.isRequired,
        fluid: PropTypes.bool,
        translate: PropTypes.func,
        noPopup: PropTypes.bool,
    };

    static defaultProps = {
        format: 'MMMM yyyy',
        fluid: false,
        noPopup: false,
    };

    state = { open: false };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(value) {
        const { onChange } = this.props;

        value = { year: value.year, month: value.month };
        onChange(value);
        this.onClose();
    }

    onOpen(e) {
        e.preventDefault();
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    translate(...args) {
        return (this.props.translate || translate)(...args);
    }

    render() {
        const { value, format, className, fluid, style, translate, noPopup, ...props } = this.props;
        const { open } = this.state;

        delete props.onChange;

        const classes = ['daycy', 'month-picker'];
        if (className) {
            classes.push(className);
        }
        if (open) {
            classes.push('focus');
        }
        if (fluid) {
            classes.push('fluid');
        }

        return (
            <MonthCalendar
                open={!noPopup && open}
                value={value}
                onChange={this.onChange}
                translate={translate}
                trigger={
                    <MonthInput
                        innerRef={(ref) => this.input = ref}
                        className={`daycy month-picker${props.fluid ? ' fluid' : ''}`}
                        value={value !== null ? new DateTime(value.year, value.month) : null}
                        onChange={this.onChange}
                        onFocus={this.onOpen}
                        onBlur={this.onClose}
                        focus={open}
                        {...props}
                    />
                }
            />
        );
    }
}
