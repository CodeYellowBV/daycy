import React, { Component } from 'react';
import Semantic, { Input } from 'semantic-ui-react';
import { DateTime, Interval } from 'luxon';
import { TranslationFn } from './translate';

import Calendar from './Calendar';

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

interface DatePickerProps extends Omit<Semantic.InputProps, "onChange"> {
    value?: DateTime;
    onChange: (date: DateTime) => void;
    format?: string;
    translate?: TranslationFn;
    fluid?: boolean;
    includeWeeks?: boolean;
    onWeekSelect?: (week: Interval) => void;
}

interface DatePickerState {
    open: boolean;
}

export default class DatePicker extends Component<DatePickerProps, DatePickerState> {
    state: Readonly<DatePickerState> = {
        open: false,
    };

    constructor(props: DatePickerProps, state?: DatePickerState) {
        super(props, state);
        this.onChange = this.onChange.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    onChange(value: DateTime) {
        const { onChange } = this.props;
        onChange(value);
        this.onClose();
    }

    onOpen(e: React.SyntheticEvent) {
        e.preventDefault();
        this.setState({ open: true });
    }

    onClose() {
        this.setState({ open: false });
    }

    render() {
        const { 
            value,
            translate,
            includeWeeks,
            onWeekSelect, 
            onChange,
            fluid = false,
            format = 'dd-LL-yyyy',
            ...props
        } = this.props;
        const { open } = this.state;

        return (
            <Calendar
                open={open}
                value={value}
                onChange={this.onChange}
                onClose={this.onClose}
                trigger={
                    <Input
                        className={`daycy date-picker${fluid ? ' fluid' : ''}`}
                        value={value ? value.toFormat(format) : ''}
                        readOnly
                        focus={open}
                        fluid={fluid}
                        onClick={this.onOpen}
                        {...props}
                    />
                }
                translate={translate}
                includeWeeks={includeWeeks}
                onWeekSelect={onWeekSelect}
            />
        );
    }
}
