import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateTime, Interval } from 'luxon';
import { DatePicker, DateRangePicker, objectLookup } from '../src/index';

import 'semantic-ui-css/semantic.min.css';
import '../src/daycy.css';

const translate = objectLookup({
    calendar: {
        day: {
            monday: 'Mo',
            tuesday: 'Tu',
            wednesday: 'We',
            thursday: 'Th',
            friday: 'Fr',
            saturday: 'Sa',
            sunday: 'Su',
        },
        month: {
            '1': 'January',
            '2': 'February',
            '3': 'March',
            '4': 'April',
            '5': 'May',
            '6': 'June',
            '7': 'July',
            '8': 'August',
            '9': 'September',
            '10': 'October',
            '11': 'November',
            '12': 'December',
        },
    },
    dateRangePicker: {
        startDate: 'Start Date',
        endDate: 'End Date',
    },
});

const date = DateTime.local();
const interval = Interval.fromDateTimes(date, date.plus({ weeks: 1 }));

storiesOf('DatePicker', module)
    .add('empty', () => (
        <DatePicker 
            placeholder="Date"
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
            translate={translate}
        />
    ))
    .add('filled', () => (
        <DatePicker 
            placeholder="Date"
            value={date}
            onChange={action('changed')}
            style={{ margin: '1rem', width: '19.5rem' }}
            translate={translate}
        />
    ));

storiesOf('DateRangePicker', module)
    .add('empty', () => (
        <DateRangePicker 
            value={null}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
            translate={translate}
        />
    ))
    .add('filled', () => (
        <DateRangePicker 
            value={interval}
            onChange={action('changed')}
            style={{ margin: '1rem' }}
            translate={translate}
        />
    ));
