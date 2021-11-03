import React from 'react';
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

storiesOf('DatePicker', module)
    .add('empty', () => (
        <DatePicker
            placeholder="Date"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('filled', () => (
        <DatePicker
            placeholder="Date"
            value={date}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('empty with weeks', () => (
        <DatePicker
            placeholder="Date"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
            includeWeeks
        />
    ))
    .add('filled with weeks', () => (
        <DatePicker
            placeholder="Date"
            value={date}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
            includeWeeks
        />
    ));

storiesOf('DateRangePicker', module)
    .add('empty', () => (
        <DateRangePicker
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
        />
    ))
    .add('filled', () => (
        <DateRangePicker
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            value={interval}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
        />
    ))
    .add('empty with weeks', () => (
        <DateRangePicker
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
            includeWeeks
        />
    ))
    .add('filled with weeks', () => (
        <DateRangePicker
            startPlaceholder="Start Date"
            endPlaceholder="End Date"
            value={interval}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
            includeWeeks
        />
    ));

storiesOf('TimePicker', module)
    .add('empty', () => (
        <TimePicker
            placeholder="Time"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('filled', () => (
        <TimePicker
            placeholder="Time"
            value={date}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));

storiesOf('TimeRangePicker', module)
    .add('empty', () => (
        <TimeRangePicker
            startPlaceholder="Start Time"
            endPlaceholder="End Time"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
        />
    ))
    .add('filled', () => (
        <TimeRangePicker
            startPlaceholder="Start Time"
            endPlaceholder="End Time"
            value={interval}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
        />
    ));

storiesOf('WeekPicker', module)
    .add('empty', () => (
        <WeekPicker
            placeholder="Week"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('filled', () => (
        <WeekPicker
            placeholder="Week"
            value={week}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('empty with dates', () => (
        <WeekPicker includeDates
            placeholder="Week"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('filled with dates', () => (
        <WeekPicker includeDates
            placeholder="Week"
            value={week}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));

storiesOf('MonthPicker', module)
    .add('empty', () => (
        <MonthPicker
            placeholder="Month"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ))
    .add('filled', () => (
        <MonthPicker
            placeholder="Month"
            value={month}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
        />
    ));
