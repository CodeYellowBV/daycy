import React, { Component } from 'react';
import { Popup, Icon } from 'semantic-ui-react';
import { DateTime, Interval } from 'luxon';

import { translate, TranslationFn } from './translate';

type Day = (
    'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' |
    'sunday'
);
const DAYS: Day[] = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
    'sunday',
];
type Month = (
    'january' | 'february' | 'march' | 'april' | 'may' | 'june' | 'july' |
    'august' | 'september' | 'october' | 'november' | 'december'
);
const MONTHS: Month[] = [
    'january', 'february', 'march', 'april', 'may', 'june', 'july',
    'august', 'september', 'october', 'november', 'december',
];

type Week = { 0: DateTime, length: 7 } & Array<DateTime>;

interface CalendarProps {
    trigger: React.ReactNode;
    open: boolean;
    value?: DateTime,
    onChange: (date: DateTime) => void;
    onClose: () => void;
    highlightStart?: DateTime;
    highlightEnd?: DateTime;
    hover?: 'start' | 'end' | 'week';
    includeWeeks?: boolean;
    onWeekSelect?: (week: Interval) => void;
    translate?: TranslationFn;
}

interface CalendarState {
    value: DateTime | null;
    month: DateTime | null;
    weeks: Week[] | null;
    hovering: Interval | null,
}

export default class Calendar extends Component<CalendarProps, CalendarState> {
    state: Readonly<CalendarState> = {
        value: null,
        month: null,
        weeks: null,
        hovering: null,
    };

    constructor(props: CalendarProps, state?: CalendarState) {
        super(props, state);
        this.setPrevMonth = this.setPrevMonth.bind(this);
        this.setNextMonth = this.setNextMonth.bind(this);
        this.renderDay = this.renderDay.bind(this);
        this.renderWeek = this.renderWeek.bind(this);
        this.renderDate = this.renderDate.bind(this);
    }

    get translate() {
        return this.props.translate || translate;
    }

    static getDerivedStateFromProps(
        { open, value, highlightStart, highlightEnd }: CalendarProps,
        { month, weeks }: CalendarState,
    ) {
        const updates: Partial<CalendarState> = {};
        
        if (value) {
            updates.value = value.startOf('day');
        } else {
            updates.value = undefined;
        }

        if (open) {
            if (!month) {
                const date = (
                    value ||
                    highlightStart ||
                    highlightEnd || 
                    DateTime.local()
                );
                month = date.startOf('month');
                updates.month = month;
            }
            if (!weeks) {
                weeks = [];
                let date = month.startOf('week');
                const endOfMonth = month.endOf('month');
                while (date <= endOfMonth) {
                    weeks.push([
                        date,
                        date.plus({ days: 1}),
                        date.plus({ days: 2}),
                        date.plus({ days: 3}),
                        date.plus({ days: 4}),
                        date.plus({ days: 5}),
                        date.plus({ days: 6}),
                    ]);
                }
                updates.weeks = weeks;
            }
        } else {
            updates.month = undefined;
            updates.weeks = undefined;
            updates.hovering = undefined;
        }

        return updates;
    }

    setPrevMonth() {
        const { month } = this.state;
        if (month instanceof DateTime) {
            this.setState({
                month: month.minus({ months: 1 }),
                weeks: null, // Makes getDerivedStateFromProps recompute
            });
        }
    }

    setNextMonth() {
        const { month } = this.state;
        if (month instanceof DateTime) {
            this.setState({
                month: month.plus({ months: 1}),
                weeks: null, // Makes getDerivedStateFromProps recompute
            });
        }
    }

    renderDay(day: Day, i: number) {
        return (
            <div className={`cell label${i === 0 ? ' first' : ''}`} key={day}>
                {this.translate(`weekDay.${day}`)}
            </div>
        );
    }

    renderWeek(dates: Week) {
        const { includeWeeks, onWeekSelect } = this.props;

        const weekProps: React.HTMLAttributes<HTMLDivElement> = { className: 'cell week' };
        if (includeWeeks && onWeekSelect) {
            const week = Interval.fromDateTimes(dates[0], dates[6].endOf('day'));
            weekProps.className += ' selectable';
            weekProps.onMouseEnter = () => this.setState({ hovering: week });
            weekProps.onMouseLeave = () => this.setState({ hovering: null });
            weekProps.onClick = () => onWeekSelect(week);
        }

        return (
            <div className="row" key={dates[0].toFormat('dd-LL-yyyy')}>
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

    renderDate(date: DateTime, i: number) {
        const { hover, highlightStart, highlightEnd, onChange } = this.props;
        let { value, month, hovering } = this.state;

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

        if (hovering && hovering.contains(date)) {
            classes.push('hover');
        }
        if (month && (date.year !== month.year || date.month !== month.month)) {
            classes.push('outside');
        }

        return (
            <div
                key={date.toFormat('dd-LL-yyyy')}
                className={classes.join(' ')}
                onClick={() => onChange(date)}
                onMouseEnter={() => this.setState({ hovering: (
                    hover === 'start' ? (
                        highlightEnd ? Interval.fromDateTimes(date.startOf('day'), highlightEnd) : null
                    ) : hover === 'end' ? (
                        highlightStart ? Interval.fromDateTimes(highlightStart, date.endOf('day')) : null
                    ) : hover === 'week' ? (
                        Interval.fromDateTimes(date.startOf('week'), date.endOf('week'))
                    ) : (
                        null
                    )
                ) })}
                onMouseLeave={() => this.setState({ hovering: null })}
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
