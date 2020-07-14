import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import Calendar from './Calendar';
import DateInput from './DateInput';

export default class DatePicker extends Component {
    static propTypes = {
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        format: PropTypes.string,
        translate: PropTypes.func,
        fluid: PropTypes.bool,
        includeWeeks: PropTypes.bool,
        onWeekSelect: PropTypes.func,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
        fluid: false,
    };

    state = { open: false };
    calendar = null;

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onChangeNoClose = this.onChangeNoClose.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(value, close = true) {
        const { onChange } = this.props;
        onChange(value);
        if (close) {
            this.onClose();
        } else {
            this.calendar.setState({
                month: value.startOf('month'),
                weeks: null,
            });
        }
    }

    onChangeNoClose(value) {
        return this.onChange(value, false); 
    }

    onOpen() {
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    render() {
        const { value, translate, includeWeeks, onWeekSelect, ...props } = this.props;
        const { open } = this.state;

        delete props.onChange;

        return (
            <Calendar
                ref={(ref) => this.calendar = ref}
                open={open}
                value={value}
                onChange={this.onChange}
                onClose={this.onClose}
                trigger={
                    <DateInput
                        className={`daycy date-picker${props.fluid ? ' fluid' : ''}`}
                        value={value}
                        onChange={this.onChangeNoClose}
                        onClick={this.onOpen}
                        focus={open}
                        {...props}
                    />
                }
                translate={translate}
                includeWeeks={includeWeeks}
                onWeekSelect={onWeekSelect}
            />
        );
    }
}
