import React, { Component, HTMLAttributes } from 'react';
import PropTypes from 'prop-types';
import Semantic, { Icon, Input } from 'semantic-ui-react';
import { Interval, DateTime } from 'luxon';

import Calendar from './Calendar';
import { TranslationFn } from './translate';

interface DateRange {
    start: DateTime | null;
    end: DateTime | null;
}

interface OtherType {
    [key: string]: keyof DateRange;
}

const OTHER: OtherType = { start: 'end', end: 'start' };
const EMPTY: DateRange = { start: null, end: null };

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface DateRangePickerProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
    value?: Interval;
    onChange: (range: Interval) => void;
    format?: string;
    seperator?: React.ReactNode;
    icon?: Semantic.IconProps['name'];
    startProps?: Partial<Semantic.InputProps>;
    endProps?: Partial<Semantic.InputProps>;
    startPlaceholder?: string;
    endPlaceholder?: string;
    fluid: boolean;
    translate: TranslationFn;
    includeWeeks: boolean;
}

interface DateRangePickerState {
    open: keyof DateRange | null;
    override: DateRange | null;
}

export default class DateRangePicker extends Component<DateRangePickerProps, DateRangePickerState> {
    state: Readonly<DateRangePickerState> = {
        open: null,
        override: null,
    };

    constructor(props: DateRangePickerProps, state?: DateRangePickerState) {
        super(props, state);
        this.onChange = this.onChange.bind(this);
        this.onWeekSelect = this.onWeekSelect.bind(this);
        this.onOpenStart = this.onOpenStart.bind(this);
        this.onOpenEnd = this.onOpenEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(date: DateTime) {
        const { value: baseValue, onChange } = this.props;
        const { open, override } = this.state;

        if (open !== null) {
            let value: DateRange = override || baseValue || EMPTY;
            if (open === 'start') {
                if (!value.end || date > value.end) {
                    this.setState({
                        open: 'end',
                        override: { start: date, end: null },
                    });
                } else {
                    onChange(Interval.fromDateTimes(date, value.end));
                    this.onClose();
                }
            } else if (open === 'end') {
                if (!value.start || date < value.start) {
                    this.setState({
                        open: 'start',
                        override: { start: null, end: date },
                    });
                } else {
                    onChange(Interval.fromDateTimes(value.start, date));
                    this.onClose();
                }
            }
        }
    }

    onWeekSelect(week: Interval) {
        const { onChange } = this.props;
        onChange(week);
        this.onClose();
    }

    onOpenStart(e: React.SyntheticEvent) {
        e.preventDefault();
        this.setState({ open: 'start' });
    }

    onOpenEnd(e: React.SyntheticEvent) {
        e.preventDefault();
        this.setState({ open: 'end' });
    }

    onClose() {
        this.setState({ open: null, override: null });
    }

    render() {
        let {
            value: baseValue,
            seperator,
            translate,
            fluid,
            includeWeeks,
            icon,
            onChange,
            startPlaceholder = '',
            endPlaceholder = '',
            startProps = {},
            endProps = {},
            format = 'dd-LL-yyyy',
            ...props
        } = this.props;
        const { open, override } = this.state;

        const value: DateRange = override || baseValue || EMPTY;

        if (!seperator) {
            seperator = (
                <Icon name={icon || 'arrow right'} className="date-range-seperator" />
            );
        }

        startProps = { placeholder: startPlaceholder, ...startProps };
        endProps = { placeholder: endPlaceholder, ...endProps };

        const classes = ['daycy', 'date-range-picker'];
        if (open !== null) {
            classes.push('focus');
        }
        if (fluid) {
            classes.push('fluid');
        }

        return (
            <Calendar
                open={open !== null}
                value={(open && value[open]) || undefined}
                onChange={this.onChange}
                onClose={this.onClose}
                hover={open || undefined}
                highlightStart={value.start || value.end || undefined}
                highlightEnd={value.end || value.start || undefined}
                trigger={
                    <div className={classes.join(' ')} {...props}>
                        <Input
                            readOnly className="start-date"
                            value={value.start ? value.start.toFormat(format) : ''}
                            onClick={this.onOpenStart}
                            {...startProps}
                        />
                        {seperator}
                        <Input
                            readOnly className="end-date"
                            value={value.end ? value.end.toFormat(format) : ''}
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
