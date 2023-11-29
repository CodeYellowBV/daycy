import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';

import Clock from './Clock';
import TimeInput from './TimeInput';

export default class TimePicker extends Component {
    static propTypes = {
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        format: PropTypes.string,
        fluid: PropTypes.bool,
        translate: PropTypes.func,
        noPopup: PropTypes.bool,
    };

    static defaultProps = {
        format: 'H:mm',
        fluid: false,
        noPopup: false,
    };

    state = { open: false };

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
        const { value, format, translate, noPopup, ...props } = this.props;
        const { open } = this.state;

        delete props.onFocus;
        delete props.onBlur;
        delete props.onChange;

        return (
            <Clock
                open={!noPopup && open}
                value={value}
                onChange={this.onChange}
                translate={translate}
                trigger={
                    <TimeInput
                        innerRef={(ref) => this.input = ref}
                        className={`daycy time-picker${props.fluid ? ' fluid' : ''}`}
                        value={value}
                        onChange={this.onChangeNoClose}
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
