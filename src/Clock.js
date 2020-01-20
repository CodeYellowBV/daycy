import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popup } from 'semantic-ui-react';
import { DateTime } from 'luxon';

import { translate } from './translate';

const POINTER_LENGTH = {
    hour: '2.5rem',
    minute: '3.5rem',
};
const POINTER_WIDTH = {
    hour: 6,
    minute: 4,
};
const PERIODS = ['am', 'pm'];

function range(start, stop, step = 1) {
    if (stop === undefined) {
        stop = start;
        start = 0;
    }
    const items = [];
    for (let item = start; item < stop; item += step) {
        items.push(item);
    }
    return items;
}

export default class Clock extends Component {
    static propTypes = {
        trigger: PropTypes.node.isRequired,
        open: PropTypes.bool.isRequired,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        onClose: PropTypes.func,
        translate: PropTypes.func,
    };

    static defaultProps = {
        onClose: () => {},
    };

    state = {
        period: 'am',

        hour: null,
        hourHover: null,
        lastHourHover: 12,

        minuteHover: null,
        lastMinuteHover: 60,
    };

    constructor(...args) {
        super(...args);
        this.renderHour = this.renderHour.bind(this);
        this.renderMinute = this.renderMinute.bind(this);
        this.renderPeriod = this.renderPeriod.bind(this);
    }

    translate(...args) {
        return (this.props.translate || translate)(...args);
    }

    renderHour(hour) {
        const { hour: selectedHour, period } = this.state;

        const classes = ['button'];

        if (selectedHour !== null) {
            classes.push('small');
        }
        if (hour === selectedHour) {
            classes.push('selected');
        }

        const angle = Math.PI * 2 * (hour - 3) / 12;
        return (
            <div
                key={hour}
                className={classes.join(' ')}
                style={{
                    left: `${6 + 6 * Math.cos(angle)}rem`,
                    top: `${6 + 6 * Math.sin(angle)}rem`,
                    transformOrigin: `${-6 * Math.cos(angle)}rem ${-6 * Math.sin(angle)}rem`,
                }}
                onMouseEnter={() => this.setState({ hourHover: hour })}
                onMouseLeave={() => this.setState({ hourHover: null, lastHourHover: hour })}
                onClick={() => this.setState({ hour })}
            >
                {(period === 'pm' ? 12 : 0) + hour}
            </div>
        );
    }

    renderMinute(minute) {
        const { onChange } = this.props;
        const { period, hour } = this.state;

        const classes = ['button'];

        if (hour === null) {
            classes.push('disabled');
        }

        const angle = Math.PI * 2 * (minute - 15) / 60;
        return (
            <div
                key={minute}
                className={classes.join(' ')}
                style={{
                    left: `${6 + 6 * Math.cos(angle)}rem`,
                    top: `${6 + 6 * Math.sin(angle)}rem`,
                    transformOrigin: `${-6 * Math.cos(angle)}rem ${-6 * Math.sin(angle)}rem`,
                }}
                onMouseEnter={() => this.setState({ minuteHover: minute })}
                onMouseLeave={() => this.setState({ minuteHover: null, lastMinuteHover: minute })}
                onClick={() => {
                    onChange(DateTime.fromObject({ hour: (hour + (period === 'pm' ? 12 : 0)) % 24, minute }))
                    this.setState({
                        period: 'am',

                        hour: null,
                        hourHover: null,
                        lastHourHover: 12,

                        minuteHover: null,
                        lastMinuteHover: 60,
                    });
                }}
            >
                {minute}
            </div>
        );
    }

    renderPointer({ type, angle, hide = false }) {
        const length = POINTER_LENGTH[type];
        const width = POINTER_WIDTH[type];

        return (
            <div
                className={`pointer ${type} ${hide ? ' hide' : ''}`}
                style={{
                    height: `${width}px`,
                    width: `calc(${length} + ${width}px)`,
                    borderRadius: `${width / 2}px`,
                    left: `calc(6rem - ${width / 2 + 2}px)`,
                    top: `calc(6rem - ${width / 2 + 2}px)`,
                    transformOrigin: `${width / 2}px ${width / 2}px`,
                    transform: `rotate(${angle}rad)`,
                }}
            />
        );
    }

    renderPeriod(period) {
        const { period: selectedPeriod } = this.state;
        return (
            <button
                key={period}
                className={`period ${period}${period === selectedPeriod ? ' selected' : ''}`}
                onClick={() => this.setState({ period })}
            >
                {this.translate(`period.${period}`)}
            </button>
        );
    }

    render() {
        const { trigger, open, onClose } = this.props;
        const {
            period,
            hour, hourHover, lastHourHover,
            minuteHover, lastMinuteHover,
        } = this.state;

        return (
            <Popup
                className="daycy clock"
                flowing
                trigger={trigger}
                open={open}
                on="click"
                onClose={onClose}
            >
                <div className="face">
                    {range(0, 60, 5).map(this.renderMinute)}
                    {range(1, 13).map(this.renderHour)}
                    <div className={`period-bg ${period}`} />
                    {PERIODS.map(this.renderPeriod)}
                    {this.renderPointer({
                        type: 'minute',
                        angle: Math.PI * 2 * ((minuteHover || lastMinuteHover) - 15) / 60,
                        hide: minuteHover === null,
                    })}
                    {this.renderPointer({
                        type: 'hour',
                        angle: Math.PI * 2 * ((hourHover || hour || lastHourHover) - 3) / 12,
                        hide: (hourHover || hour) === null,
                    })}
                </div>
            </Popup>
        );
    }
}
