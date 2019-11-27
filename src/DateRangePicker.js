import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'semantic-ui-react';
import { Interval } from 'luxon';

import DateInput from './DateInput';
import Calendar from './Calendar';

const OTHER = { start: 'end', end: 'start' };
const EMPTY = { start: null, end: null };

export default class DateRangePicker extends Component {
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
        includeWeeks: PropTypes.bool,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
        icon: 'arrow right',
        startProps: {},
        endProps: {},
        startPlaceholder: '',
        endPlaceholder: '',
        fluid: false,
    };

    state = { open: null, override: null };
    container = null;
    calendar = null;

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onChangeNoClose = this.onChangeNoClose.bind(this);
        this.onWeekSelect = this.onWeekSelect.bind(this);
        this.onOpenStart = this.onOpenStart.bind(this);
        this.onOpenEnd = this.onOpenEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(date, close = true) {
        let { value, onChange } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;
        let other = OTHER[open];

        if (
            value[other] === null ||
            (open === 'start' && date > value.end) ||
            (open === 'end' && date < value.start)
        ) {
            const suiInput = this.container.getElementsByClassName(`${other}-date`)[0];
            const input = suiInput.getElementsByTagName('input')[0];
            input.focus();

            this.setState({
                open: other,
                override: { [open]: date, [other]: null },
            });
            this.calendar.setState({
                month: date.startOf('month'),
                weeks: null,
            });
        } else {
            value = { [open]: date, [other]: value[other] };
            onChange(Interval.fromDateTimes(value.start, value.end));
            if (close) {
                this.onClose();
            } else {
                this.calendar.setState({
                    month: date.startOf('month'),
                    weeks: null,
                });
            }
        }
    }

    onChangeNoClose(date) {
        return this.onChange(date, false);
    }

    onWeekSelect(week) {
        const { onChange } = this.props;
        onChange(week);
        this.onClose();
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
            startPlaceholder, endPlaceholder, fluid, includeWeeks,
            ...props
        } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;

        if (typeof icon === 'string') {
            icon = (
                <Icon name={icon} className="date-range-seperator" />
            );
        }

        startProps = { placeholder: startPlaceholder, ...startProps };
        endProps = { placeholder: endPlaceholder, ...endProps };

        delete props.onChange;

        const classes = ['daycy', 'date-range-picker'];
        if (open !== null) {
            classes.push('focus');
        }
        if (fluid) {
            classes.push('fluid');
        }

        return (
            <Calendar
                ref={(ref) => this.calendar = ref}
                open={open !== null}
                value={value[open]}
                onChange={this.onChange}
                onClose={this.onClose}
                hover={open}
                highlightStart={value.start || value.end}
                highlightEnd={value.end || value.start}
                trigger={
                    <div
                        ref={(ref) => this.container = ref}
                        className={classes.join(' ')} {...props}
                    >
                        <DateInput
                            className="start-date"
                            value={value.start}
                            onChange={this.onChangeNoClose}
                            onClick={this.onOpenStart}
                            {...startProps}
                        />
                        {icon}
                        <DateInput
                            className="end-date"
                            value={value.end}
                            onChange={this.onChangeNoClose}
                            onClick={this.onOpenEnd}
                            {...endProps}
                        />
                    </div>
                }
                translate={translate}
                includeWeeks={includeWeeks}
                onWeekSelect={this.onWeekSelect}
            />
        );
    }
}
