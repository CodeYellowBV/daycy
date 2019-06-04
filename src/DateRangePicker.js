import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input } from 'semantic-ui-react';
import { Interval } from 'luxon';

import Calendar from './Calendar';

const OTHER = { start: 'end', end: 'start' };
const EMPTY = { start: null, end: null };

export default class DateRangePicker extends Component {
    static propTypes = {
        value: PropTypes.instanceOf(Interval),
        onChange: PropTypes.func.isRequired,
        format: PropTypes.string,
        icon: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.node,
        ]),
        startProps: PropTypes.object,
        endProps: PropTypes.object,
        startPlaceholder: PropTypes.string,
        endPlaceholder: PropTypes.string,
        fluid: PropTypes.bool,
        translate: PropTypes.func,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
        icon: 'arrow right',
        startProps: {},
        endProps: {},
        startPlaceholder: '',
        endPlaceholder: '',
        fluid: false,
    };

    state = { open: null, override: null };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onOpenStart = this.onOpenStart.bind(this);
        this.onOpenEnd = this.onOpenEnd.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(date) {
        let { value, onChange } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;
        let other = OTHER[open];

        if (
            value[other] === null ||
            (open === 'start' && date > value.end) ||
            (open === 'end' && date < value.start)
        ) {
            this.setState({
                open: other,
                override: { [open]: date, [other]: null },
            });
        } else {
            value = { [open]: date, [other]: value[other] };
            onChange(Interval.fromDateTimes(value.start, value.end));
            this.onClose();
        }
    }

    onOpenStart(e) {
        e.preventDefault();
        this.setState({ open: 'start' });
    }

    onOpenEnd(e) {
        e.preventDefault();
        this.setState({ open: 'end' });
    }

    onClose() {
        this.setState({ open: null, override: null });
    }

    render() {
        let {
            value, format, icon, translate, startProps, endProps,
            startPlaceholder, endPlaceholder, fluid, ...props
        } = this.props;
        const { open, override } = this.state;

        value = override || value || EMPTY;

        if (typeof icon === 'string') {
            icon = (
                <Icon name={icon} className="date-range-seperator" />
            );
        }

        startProps = { placeholder: startPlaceholder, ...startProps };
        endProps = { placeholder: endPlaceholder, ...endProps };

        delete props.onChange;

        const classes = ['daycy', 'date-range-picker'];
        if (open !== null) {
            classes.push('focus');
        }
        if (fluid) {
            classes.push('fluid');
        }

        return (
            <Calendar
                open={open !== null}
                value={value[open]}
                onChange={this.onChange}
                onClose={this.onClose}
                hover={open}
                highlightStart={value.start || value.end}
                highlightEnd={value.end || value.start}
                trigger={
                    <div className={classes.join(' ')} {...props}>
                        <Input
                            readOnly className="start-date"
                            value={value.start ? value.start.toFormat(format) : ''}
                            onClick={this.onOpenStart}
                            {...startProps}
                        />
                        {icon}
                        <Input
                            readOnly className="end-date"
                            value={value.end ? value.end.toFormat(format) : ''}
                            onClick={this.onOpenEnd}
                            {...endProps}
                        />
                    </div>
                }
                translate={translate}
            />
        );
    }
}
