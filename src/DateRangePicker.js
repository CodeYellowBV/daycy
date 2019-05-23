import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import { Interval } from 'luxon';

import Calendar from './Calendar';
const OTHER = { start: 'end', end: 'start' };
const EMPTY = { start: null, end: null };

export class DateRangePicker extends Component {
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
    };

    static defaultProps = {
        format: 'DD-MM-YYYY',
        icon: 'arrow right',
        startProps: {},
        endProps: {},
    };

    static defaultStartProps = {
        placeholder: t('dates.minDate.placeholder'),
    };

    static defaultEndProps = {
        placeholder: t('dates.maxDate.placeholder'),
    };

    state = { open: null, override: null };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onOpenStart = this.onOpenStart.bind(this);
        this.onOpenEnd = this.onOpenEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(date) {
        let { value, onChange } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;
        let other = OTHER[open];

        if (
            value[other] === null ||
            (open === 'start' && date > value.end) ||
            (open === 'end' && date < value.start)
        ) {
            this.setState({
                open: other,
                override: { [open]: date, [other]: null },
            });
        } else {
            value = { [open]: date, [other]: value[other] };
            onChange(Interval.fromDateTimes(value.start, value.end));
            this.onClose();
        }
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
        let { value, format, icon, startProps, endProps, ...props } = this.props;
        const { open, override } = this.props;

        value = override || value || EMPTY;

        if (typeof icon === 'string') {
            icon = (
                <Icon name={icon} className="date-range-seperator" />
            );
        }

        startProps = { ...this.constructor.defaultStartProps, ...startProps };
        endProps = { ...this.constructor.defaultEndProps, ...endProps };

        delete props.onChange;

        return (
            <Calendar
                open={open !== null}
                value={value[open]}
                onChange={this.onChange}
                onClose={this.onClose}
                hoverHighlight={open}
                highlight={
                    (value.start || value.end) &&
                    Interval.fromDateTimes(
                        value.start || value.end,
                        value.end || value.start,
                    )
                }
                trigger={
                    <div className={
                        `cy-dates date-range-picker${open !== null ? ' focus' : ''}`
                    }>
                        <Input
                            readOnly
                            value={value.start ? value.start.toFormat(format) : ''}
                            onClick={this.onOpenStart}
                            {...startProps}
                        />
                        {icon}
                        <Input
                            readOnly
                            value={value.end ? value.end.toFormat(format) : ''}
                            onClick={this.onOpenEnd}
                            {...endProps}
                        />
                    </div>
                }
            />
        );
    }
}
