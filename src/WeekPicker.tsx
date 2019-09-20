import React, { Component } from 'react';
import Semantic, { Input } from 'semantic-ui-react';
import { DateTime, Interval } from 'luxon';
import { TranslationFn } from './translate';

import { translate } from './translate';

import Calendar from './Calendar';

interface ISOWeek {
    year: number,
    week: number,
}

export function isoWeekStart({ year, week }: ISOWeek): DateTime {
    return (
        DateTime.local(year, 1, 4)
        .plus({ weeks: week - 1})
        .startOf('week')
    );
}

export function isoWeekEnd({ year, week }: ISOWeek): DateTime {
    return (
        DateTime.local(year, 1, 4)
        .plus({ weeks: week - 1})
        .endOf('week')
    );
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface WeekPickerProps extends Omit<Semantic.InputProps, "onChange"> {
    value: ISOWeek;
    onChange: (week: ISOWeek) => void;
    translate?: TranslationFn;
    fluid?: boolean;
    format?: string;
    includeDates?: boolean;
    className?: string;
    style?: React.CSSProperties;
}

interface WeekPickerState {
    open: boolean;
}

export default class WeekPicker extends Component<WeekPickerProps, WeekPickerState> {
    state: Readonly<WeekPickerState> = {
        open: false,
    };

    constructor(props: WeekPickerProps, state: WeekPickerState) {
        super(props, state);
        this.onChange = this.onChange.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(value: Interval | DateTime) {
        const { onChange } = this.props;
        if (value instanceof Interval) {
            value = value.start;
        }
        onChange({ year: value.weekYear, week: value.weekNumber });
        this.onClose();
    }

    onOpen(e: React.SyntheticEvent) {
        e.preventDefault();
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    get translate() {
        return this.props.translate || translate;
    }

    render() {
        const {
            value,
            translate, 
            className, 
            style, 
            format = 'dd-LL-yyyy', 
            fluid = false, 
            includeDates = false,
            onChange, // So that props type checks for Semantic.InputProps
            ...props
        } = this.props;
        const { open } = this.state;

        const classes = ['daycy', 'week-picker'];
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
            <Calendar
                open={open}
                onChange={this.onChange}
                onClose={this.onClose}
                highlightStart={value && isoWeekStart(value)}
                highlightEnd={value && isoWeekEnd(value)}
                hover="week"
                trigger={
                    <div className={classes.join(' ')} style={style} onClick={this.onOpen}>
                        <Input
                            value={value ? this.translate('week.value', value) : ''}
                            readOnly
                            focus={open}
                            {...props}
                        />
                        {(includeDates && value) && (
                            <label>
                                {isoWeekStart(value).toFormat(format)}
                                {' - '}
                                {isoWeekEnd(value).toFormat(format)}
                            </label>
                        )}
                    </div>
                }
                translate={translate}
                includeWeeks={true}
                onWeekSelect={this.onChange}
            />
        );
    }
}
