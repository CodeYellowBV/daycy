import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { DateTime, Interval } from 'luxon';
import { DatePicker, DateRangePicker } from '../src/index';

import 'semantic-ui-css/semantic.min.css';
import '../src/daycy.css';

const date = DateTime.local();
const interval = Interval.fromDateTimes(date, date.plus({ weeks: 1 }));

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
    ));
