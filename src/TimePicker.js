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
    };

    static defaultProps = {
        format: 'H:mm',
        fluid: false,
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
            this.onClose();
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
        const { value, format, translate, ...props } = this.props;
        const { open } = this.state;

        delete props.onChange;

        return (
            <Clock
                open={open}
                value={value}
                onChange={this.onChange}
                onClose={this.onClose}
                translate={translate}
                trigger={
                    <TimeInput
                        className={`daycy time-picker${props.fluid ? ' fluid' : ''}`}
                        value={value}
                        onChange={this.onChangeNoClose}
                        onClick={this.onOpen}
                        focus={open}
                        {...props}
                    />
                }
            />
        );
    }
}
