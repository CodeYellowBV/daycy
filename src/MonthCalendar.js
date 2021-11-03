import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup, Icon } from 'semantic-ui-react';
import { DateTime } from 'luxon';

import { translate } from './translate';
import { MONTHS } from './Calendar';

const TRIMESTERS = [
    ['january', 'february', 'march'],
    ['april', 'may', 'june'],
    ['july', 'august', 'september'],
    ['october', 'november', 'december'],
];

export default class MonthCalendar extends Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        open: PropTypes.bool.isRequired,
        value: PropTypes.shape({
            year: PropTypes.number.isRequired,
            month: PropTypes.number.isRequired,
        }),
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        translate: PropTypes.func,
    };

    static defaultProps = {
        onClose: () => { },
    };

    state = { year: null };

    constructor(...args) {
        super(...args);
        this.setPrevYear = this.setPrevYear.bind(this);
        this.setNextYear = this.setNextYear.bind(this);
        this.renderMonths = this.renderMonths.bind(this);
        this.renderMonth = this.renderMonth.bind(this);
    }

    translate(...args) {
        return (this.props.translate || translate)(...args);
    }

    static getDerivedStateFromProps(
        { open, value },
        { year },
    ) {
        const updates = {};

        if (value) {
            updates.value = value;
        } else {
            updates.value = null;
        }

        if (!open) {
            updates.year = null;
        } else if (year === null) {
            const date = value || DateTime.local();
            updates.year = date.year;
        }

        return updates;
    }

    setPrevYear() {
        const { year } = this.state;
        this.setState({ year: year - 1 });
    }

    setNextYear() {
        const { year } = this.state;
        this.setState({ year: year + 1 });
    }

    onChange(month) {
        const { value, onChange } = this.props
        const { year } = this.state;
        onChange({ month: MONTHS.indexOf(month) + 1, year: year })
    }

    renderMonths(months, i) {
        return (
            <div className="row" key={i}>
                {months.map(this.renderMonth)}
            </div>
        );
    }

    renderMonth(month, i) {
        const { value } = this.props
        const { year } = this.state
        const classes = ['cell'];

        if (i === 0) {
            classes.push('first');
        }

        if (value && month === MONTHS[value.month - 1] && year === value.year) {
            classes.push('selected');
        }
        const monthProps = { className: classes.join(' ') };
        monthProps.onClick = () => this.onChange(month);

        return (
            <div {...monthProps} key={month}>
                <span>
                    {this.translate(`month.${month}`)}
                </span>
            </div>
        );
    }

    render() {
        const { open, trigger, onClose } = this.props;
        const { year } = this.state;

        return (
            <Popup
                className="daycy month-calendar"
                flowing
                trigger={trigger}
                open={open}
                on="click"
                onClose={onClose}
                onMouseDown={(e) => e.preventDefault()}
            >
                <div className="title">
                    <Icon name="chevron left" onClick={this.setPrevYear} />
                    {year && (
                        <span>
                            {year}
                        </span>
                    )}
                    <Icon name="chevron right" onClick={this.setNextYear} />
                </div>
                <div className="grid">
                    {TRIMESTERS.map(this.renderMonths)}
                </div>
            </Popup>
        );
    }
}
