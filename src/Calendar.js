import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { DateTime } from 'luxon';

import translate from './translate';


const DAYS = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    'sunday',
];

export default class Calendar extends Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        open: PropTypes.bool.isRequired,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func.isRequired,
        highlightStart: PropTypes.instanceOf(DateTime),
        highlightEnd: PropTypes.instanceOf(DateTime),
        hover: PropTypes.oneOf(['start', 'end']),
        translate: PropTypes.func,
    };

    static defaultProps = {
        translate,
    };

    state = { month: null, dates: null, hoverDate: null };

    constructor(...args) {
        super(...args);
        this.setPrevMonth = this.setPrevMonth.bind(this);
        this.setNextMonth = this.setNextMonth.bind(this);
        this.renderDay = this.renderDay.bind(this);
        this.renderDate = this.renderDate.bind(this);
    }

    static getDerivedStateFromProps(
        { open, value, highlightStart, highlightEnd },
        { month, dates },
    ) {
        const updates = {};
        
        if (value) {
            updates.value = value.startOf('day');
        } else {
            updates.value = null;
        }

        if (open) {
            if (month === null) {
                const date = (
                    value ||
                    highlightStart ||
                    highlightEnd || 
                    DateTime.local()
                );
                month = date.startOf('month');
                updates.month = month;
            }
            if (dates === null) {
                dates = [];
                const start = month.startOf('week');
                const end = month.endOf('month').endOf('week');
                for (let date = start; date <= end; date = date.plus({ days: 1 })) {
                    dates.push(date); 
                }
                updates.dates = dates;
            }
        } else {
            updates.month = null;
            updates.dates = null;
            updates.hoverDate = null;
        }

        return updates;
    }

    setPrevMonth() {
        const { month } = this.state;
        this.setState({
            month: month.minus({ months: 1 }),
            dates: null, // Makes getDerivedStateFromProps recompute
        });
    }

    setNextMonth() {
        const { month } = this.state;
        this.setState({
            month: month.plus({ months: 1}),
            dates: null, // Makes getDerivedStateFromProps recompute
        });
    }

    renderDay(day) {
        const { translate } = this.props;
        return (
            <div className="cell label" key={day}>
                {translate(`calendar.day.${day}`)}
            </div>
        );
    }

    renderDate(date) {
        const { hover, highlightStart, highlightEnd, onChange } = this.props;
        const { value, month, hoverDate } = this.state;

        const classes = ['cell', 'day'];

        if (value && +date === +value) {
            classes.push('selected');
        }
        if (
            highlightStart &&
            highlightEnd &&
            date >= highlightStart &&
            date <= highlightEnd
        ) {
            classes.push('range');
        }
        if (hoverDate && (
            date === hoverDate ||
            (
                hover === 'start' &&
                highlightEnd &&
                date >= hoverDate && 
                date <= highlightEnd
            ) ||
            (
                hover === 'end' &&
                highlightStart &&
                date >= highlightStart &&
                date <= hoverDate
            )
        )) {
            classes.push('hover');
        }
        if (date.year !== month.year || date.month !== month.month) {
            classes.push('outside');
        }

        return (
            <div
                key={date}
                className={classes.join(' ')}
                onClick={() => onChange(date)}
                onMouseEnter={() => this.setState({ hoverDate: date })}
                onMouseLeave={() => this.setState({ hoverDate: null })}
            >
                {date.day}
            </div>
        );
    }

    render() {
        const { open, trigger, onClose, translate } = this.props;
        const { month, dates } = this.state;

        return (
            <Popup 
                className="day-cy calendar"
                trigger={trigger} 
                open={open} 
                on="click" 
                onClose={onClose}
            >
                <div className="title">
                    <Icon name="chevron left" onClick={this.setPrevMonth} />
                    {month && (
                        <span>
                            {translate(`calendar.month.${month.month}`)} {month.year}
                        </span>
                    )}
                    <Icon name="chevron right" onClick={this.setNextMonth} />
                </div>
                <div className="grid">
                    {DAYS.map(this.renderDay)}
                    {dates && dates.map(this.renderDate)}
                </div>
            </Popup>
        );
    }
}
