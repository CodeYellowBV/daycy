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
        noPopup: PropTypes.bool,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
        fluid: false,
        noPopup: false,
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
            this.input.inputRef.current.blur();
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

    onOpen(e) {
        const { onFocus } = this.props;
        this.setState({ open: true });
        onFocus?.(e);
    }

    onClose(e) {
        const { onBlur } = this.props;
        this.setState({ open: false });
        onBlur?.(e);
    }

    render() {
        const { value, translate, includeWeeks, onWeekSelect, noPopup, ...props } = this.props;
        const { open } = this.state;

        delete props.onFocus;
        delete props.onBlur;
        delete props.onChange;

        return (
            <Calendar
                ref={(ref) => this.calendar = ref}
                open={!noPopup && open}
                value={value}
                onChange={this.onChange}
                trigger={
                    <DateInput
                        innerRef={(ref) => this.input = ref}
                        className={`daycy date-picker${props.fluid ? ' fluid' : ''}`}
                        value={value}
                        onChange={this.onChangeNoClose}
                        focus={open}
                        onFocus={this.onOpen}
                        onBlur={this.onClose}
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
