import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Interval } from 'luxon';

import TimeInput from './TimeInput';
import Clock from './Clock';

const OTHER = { start: 'end', end: 'start' };
const EMPTY = { start: null, end: null };

export default class TimeRangePicker extends Component {
    static propTypes = {
        value: PropTypes.instanceOf(Interval),
        onChange: PropTypes.func.isRequired,
        format: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]),
        startProps: PropTypes.object,
        endProps: PropTypes.object,
        startPlaceholder: PropTypes.string,
        endPlaceholder: PropTypes.string,
        fluid: PropTypes.bool,
        translate: PropTypes.func,
    };

    static defaultProps = {
        format: 'H:mm',
        icon: 'arrow right',
        startProps: {},
        endProps: {},
        startPlaceholder: '',
        endPlaceholder: '',
        fluid: false,
    };

    state = { open: null, override: null };
    container = null;

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onChangeNoClose = this.onChangeNoClose.bind(this);
        this.onOpenStart = this.onOpenStart.bind(this);
        this.onOpenEnd = this.onOpenEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(time, close = true) {
        let { value, onChange } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;
        let other = OTHER[open];

        if (value[other] === null) {
            const suiInput = this.container.getElementsByClassName(`${other}-time`)[0];
            const input = suiInput.getElementsByTagName('input')[0];
            input.focus();
            this.setState({
                open: other,
                override: { [open]: time, [other]: null },
            });
        } else {
            value = { [open]: time, [other]: value[other] };
            onChange(Interval.fromDateTimes(value.start, value.end));
            if (close) {
                this.onClose();
            }
        }
    }

    onChangeNoClose(time) {
        return this.onChange(time, false);
    }

    onOpenStart(e) {
        e.preventDefault();
        this.setState({ open: 'start' });
    }

    onOpenEnd(e) {
        e.preventDefault();
        this.setState({ open: 'end' });
    }

    onClose() {
        this.setState({ open: null, override: null });
    }

    render() {
        let {
            value, format, icon, translate, startProps, endProps,
            startPlaceholder, endPlaceholder, fluid,
            ...props
        } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;

        if (typeof icon === 'string') {
            icon = (
                <Icon name={icon} className="time-range-seperator" />
            );
        }

        startProps = { placeholder: startPlaceholder, ...startProps };
        endProps = { placeholder: endPlaceholder, ...endProps };

        delete props.onChange;

        const classes = ['daycy', 'time-range-picker'];
        if (open !== null) {
            classes.push('focus');
        }
        if (fluid) {
            classes.push('fluid');
        }

        return (
            <Clock
                open={open !== null}
                value={value[open]}
                onChange={this.onChange}
                onClose={this.onClose}
                trigger={
                    <div
                        ref={(ref) => this.container = ref}
                        className={classes.join(' ')} {...props}
                    >
                        <TimeInput
                            className="start-time"
                            value={value.start}
                            onChange={this.onChangeNoClose}
                            onClick={this.onOpenStart}
                            {...startProps}
                        />
                        {icon}
                        <TimeInput
                            className="end-time"
                            value={value.end}
                            onChange={this.onChangeNoClose}
                            onClick={this.onOpenEnd}
                            {...endProps}
                        />
                    </div>
                }
                translate={translate}
            />
        );
    }
}
