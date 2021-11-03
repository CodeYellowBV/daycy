import React, { Component } from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateTime, Interval } from 'luxon';
import { DatePicker, DateRangePicker, TimePicker, TimeRangePicker, WeekPicker, MonthPicker } from '../src/index';

import 'semantic-ui-css/semantic.min.css';
import '../src/daycy.css';

const date = DateTime.local();
const interval = Interval.fromDateTimes(date, date.plus({ weeks: 1 }));
const week = { year: date.weekYear, week: date.weekNumber };
const month = { year: date.year, month: date.month };

class Stateful extends Component {
    state = { value: null };

    render() {
        const { Component, ...props } = this.props;
        return (
            <>
                <div><b>Input:</b></div>
                <Component
                    value={this.state.value}
                    onChange={(value) => this.setState({ value })}
                    {...props}
                />
                <div><b>Value:</b></div>
                {JSON.stringify(this.state.value)}
            </>
        );
    }
}

storiesOf('DatePicker', module)
    .add('basic', () => (
        <Stateful
            Component={DatePicker}
            placeholder="Date"
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('with weeks', () => (
        <Stateful
            Component={DatePicker}
            placeholder="Date"
            style={{ margin: '1rem', width: '19.5rem' }}
            includeWeeks
        />
    ));

storiesOf('DateRangePicker', module)
    .add('empty', () => (
        <Stateful
            Component={DateRangePicker}
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            style={{ margin: '1rem' }}
        />
    ))
    .add('with weeks', () => (
        <Stateful
            Component={DateRangePicker}
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            style={{ margin: '1rem' }}
            includeWeeks
        />
    ));

storiesOf('TimePicker', module)
    .add('empty', () => (
        <Stateful
            Component={TimePicker}
            placeholder="Time"
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));

storiesOf('TimeRangePicker', module)
    .add('empty', () => (
        <Stateful
            Component={TimeRangePicker}
            startPlaceholder="Start Time"
            endPlaceholder="End Time"
            style={{ margin: '1rem' }}
        />
    ));

storiesOf('WeekPicker', module)
    .add('empty', () => (
        <Stateful
            Component={WeekPicker}
            placeholder="Week"
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('with dates', () => (
        <Stateful includeDates
            Component={WeekPicker}
            placeholder="Week"
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));

storiesOf('MonthPicker', module)
    .add('empty', () => (
        <Stateful
            Component={MonthPicker}
            placeholder="Month"
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));
