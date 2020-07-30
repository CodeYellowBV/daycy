import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { DateTime, Interval } from 'luxon';

import { translate } from './translate';

const DAYS = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    'sunday',
];
const MONTHS = [
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
    'september', 'october', 'november', 'december',
];

export default class Calendar extends Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        open: PropTypes.bool.isRequired,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        highlightStart: PropTypes.instanceOf(DateTime),
        highlightEnd: PropTypes.instanceOf(DateTime),
        hover: PropTypes.oneOf(['start', 'end', 'week']),
        includeWeeks: PropTypes.bool,
        onWeekSelect: PropTypes.func,
        translate: PropTypes.func,
    };

    static defaultProps = {
        includeWeeks: false,
        onClose: () => {},
    };

    state = { month: null, weeks: null, hoverWeek: null, hoverDate: null };

    constructor(...args) {
        super(...args);
        this.setPrevMonth = this.setPrevMonth.bind(this);
        this.setNextMonth = this.setNextMonth.bind(this);
        this.renderDay = this.renderDay.bind(this);
        this.renderWeek = this.renderWeek.bind(this);
        this.renderDate = this.renderDate.bind(this);
    }

    translate(...args) {
        return (this.props.translate || translate)(...args);
    }

    static getDerivedStateFromProps(
        { open, value, hover, highlightStart, highlightEnd },
        { month, weeks, hoverDate },
    ) {
        const updates = {};
        
        if (value) {
            updates.value = value.startOf('day');
        } else {
            updates.value = null;
        }

        if (hover === 'week' && hoverDate) {
            updates.hoverDate = null;
            updates.hoverWeek = Interval.fromDateTimes(
                hoverDate.startOf('week'),
                hoverDate.endOf('week'),
            );
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
            if (weeks === null) {
                weeks = [];
                let date = month.startOf('week');
                const endOfMonth = month.endOf('month');
                while (date <= endOfMonth) {
                    const week = []
                    for (let i = 0; i < 7; i++) {
                        week.push(date);
                        date = date.plus({ days: 1 });
                    }
                    weeks.push(week);
                }
                updates.weeks = weeks;
            }
        } else {
            updates.month = null;
            updates.weeks = null;
            updates.hoverWeek = null;
            updates.hoverDate = null;
        }

        return updates;
    }

    setPrevMonth() {
        const { month } = this.state;
        this.setState({
            month: month.minus({ months: 1 }),
            weeks: null, // Makes getDerivedStateFromProps recompute
        });
    }

    setNextMonth() {
        const { month } = this.state;
        this.setState({
            month: month.plus({ months: 1}),
            weeks: null, // Makes getDerivedStateFromProps recompute
        });
    }

    renderDay(day, i) {
        return (
            <div className={`cell label${i === 0 ? ' first' : ''}`} key={day}>
                {this.translate(`weekDay.${day}`)}
            </div>
        );
    }

    renderWeek(dates) {
        const { includeWeeks, onWeekSelect } = this.props;

        const weekProps = { className: 'cell week' };
        if (includeWeeks && onWeekSelect) {
            const week = Interval.fromDateTimes(dates[0], dates[6].endOf('day'));
            weekProps.className += ' selectable';
            weekProps.onMouseEnter = () => this.setState({ hoverWeek: week });
            weekProps.onMouseLeave = () => this.setState({ hoverWeek: null });
            weekProps.onClick = () => onWeekSelect(week);
        }

        return (
            <div className="row" key={dates[0]}>
                {includeWeeks && (
                    <div {...weekProps}>
                        {this.translate('week.number', {
                            week: dates[0].weekNumber,
                        })}
                    </div>
                )}
                {dates.map(this.renderDate)}
            </div>
        );
    }

    renderDate(date, i) {
        const { hover, highlightStart, highlightEnd, onChange } = this.props;
        const { value, month, hoverWeek, hoverDate } = this.state;

        const classes = ['cell', 'day'];

        if (i === 0) {
            classes.push('first');
        }

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
        if (hoverWeek ? (
            hoverWeek.contains(date)
        ) : hoverDate ? (
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
        ) : (
            false
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
        const { includeWeeks, open, trigger, onClose } = this.props;
        const { month, weeks } = this.state;

        return (
            <Popup 
                className="daycy calendar"
                flowing
                trigger={trigger} 
                open={open} 
                on="click" 
                onClose={onClose}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div className="title">
                    <Icon name="chevron left" onClick={this.setPrevMonth} />
                    {month && (
                        <span>
                            {this.translate(`month.${MONTHS[month.month - 1]}`)} {month.year}
                        </span>
                    )}
                    <Icon name="chevron right" onClick={this.setNextMonth} />
                </div>
                <div className="grid">
                    <div className="row">
                        {includeWeeks && (
                            <div className="cell week label">
                                {this.translate('week.label')}
                            </div>
                        )}
                        {DAYS.map(this.renderDay)}
                    </div>
                    {weeks && weeks.map(this.renderWeek)}
                </div>
            </Popup>
        );
    }
}
