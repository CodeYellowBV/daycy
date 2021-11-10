import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { DateTime, Interval } from 'luxon';

import { translate } from './translate';

import Calendar from './Calendar';

export function isoWeekStart({ year, week }) {
    return (
        DateTime.local(year, 1, 4)
        .plus({ weeks: week - 1})
        .startOf('week')
    );
}

export function isoWeekEnd({ year, week }) {
    return (
        DateTime.local(year, 1, 4)
        .plus({ weeks: week - 1})
        .endOf('week')
    );
}

export default class WeekPicker extends Component {
    static propTypes = {
        value: PropTypes.shape({
            year: PropTypes.number.isRequired,
            week: PropTypes.number.isRequired,
        }),
        onChange: PropTypes.func.isRequired,
        translate: PropTypes.func,
        fluid: PropTypes.bool,
        format: PropTypes.string,
        includeDates: PropTypes.bool,
        noPopup: PropTypes.bool,
        nullable: PropTypes.bool,
    };

    static defaultProps = {
        fluid: false,
        format: 'dd-LL-yyyy',
        includeDates: false,
        noPopup: false,
        nullable: false,
    };

    state = { open: false };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(value) {
        const { onChange } = this.props;
        if(value !== null) {
            if (value instanceof Interval) {
                value = value.start;
            }
            value = {year: value.weekYear, week: value.weekNumber};
        }
        onChange(value);
        this.onClose();
    }

    onOpen(e) {
        e.preventDefault();
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    translate(...args) {
        return (this.props.translate || translate)(...args);
    }

    render() {
        const { value, includeDates, format,
            translate, className, fluid,
            style, noPopup, nullable,
            ...props
        } = this.props;
        const { open } = this.state;

        delete props.onChange;

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
                open={!noPopup && open}
                value={null}
                onChange={this.onChange}
                onClose={this.onClose}
                highlightStart={value && isoWeekStart(value)}
                highlightEnd={value && isoWeekEnd(value)}
                hover="week"
                nullable={nullable}
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
