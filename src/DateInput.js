import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { DateTime } from 'luxon';
import MaskedInput from 'react-text-mask';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe'

// we only support auto corrected date pipe for a fixed set of common date formats
const formats = {
    'dd-LL-yyyy': 'dd-mm-yyyy',
    'LL-dd-yyyy': 'mm-dd-yyyy',
    'yyyy-LL-dd': 'yyyy-mm-dd',
    'dd/LL/yyyy': 'dd/mm/yyyy',
    'LL/dd/yyyy': 'mm/dd/yyyy',
    'yyyy/LL/dd': 'yyyy/mm/dd',
    'dd-LL': 'dd-mm',
    'LL-dd': 'mm-dd',
    'dd/LL': 'dd/mm',
    'LL/dd': 'mm/dd',
    'HH:mm': 'HH:MM',
}
const masks = {
    'dd-mm-yyyy': [/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/],
    'mm-dd-yyyy': [/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/,/\d/,/\d/],
    'yyyy-mm-dd': [/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\d/,'-',/\d/,/\d/],
    'dd/mm/yyyy': [/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/],
    'mm/dd/yyyy': [/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/,/\d/,/\d/],
    'yyyy/mm/dd': [/\d/,/\d/,/\d/,/\d/,'/',/\d/,/\d/,'/',/\d/,/\d/],
    'dd-mm': [/\d/,/\d/,'-',/\d/,/\d/],
    'mm-dd': [/\d/,/\d/,'-',/\d/,/\d/],
    'dd/mm': [/\d/,/\d/,'/',/\d/,/\d/],
    'mm/dd': [/\d/,/\d/,'/',/\d/,/\d/],
    'HH:MM': [/\d/,/\d/,':',/\d/,/\d/],
}
const formatKeepDateDefault = {
    'dd-LL-yyyy': false,
    'LL-dd-yyyy': false,
    'yyyy-LL-dd': false,
    'dd/LL/yyyy': false,
    'LL/dd/yyyy': false,
    'yyyy/LL/dd': false,
    'dd-LL': false,
    'LL-dd': false,
    'dd/LL': false,
    'LL/dd': false,
    'HH:mm': true,
}
const formatKeepTimeDefault = {
    'dd-LL-yyyy': true,
    'LL-dd-yyyy': true,
    'yyyy-LL-dd': true,
    'dd/LL/yyyy': true,
    'LL/dd/yyyy': true,
    'yyyy/LL/dd': true,
    'dd-LL': true,
    'LL-dd': true,
    'dd/LL': true,
    'LL/dd': true,
    'HH:mm': false,
}

export default class DateInput extends Component {
    static propTypes = {
        format: PropTypes.string,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
        keepDate: PropTypes.bool,
        keepTime: PropTypes.bool,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
    };

    state = {
        typeValue: null,
        format: null,
        autoCorrectedDatePipe: null,
    };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.renderInput = this.renderInput.bind(this);
    }

    static getDerivedStateFromProps(props, state) {
        if (props.format === state.format) {
            return null;
        }

        return {
            format: props.format,
            autoCorrectedDatePipe: (
                Object.keys(formats).includes(props.format)
                ? createAutoCorrectedDatePipe(formats[props.format])
                : null
            ),
        };
    }

    get keepDate() {
        const { keepDate, format } = this.props;
        return keepDate ?? formatKeepDateDefault[format] ?? false;
    }

    get keepTime() {
        const { keepTime, format } = this.props;
        return keepTime ?? formatKeepTimeDefault[format] ?? false;
    }

    onChange(e) {
        const { value, format, onChange } = this.props;

        this.setState({ typeValue: e.target.value });

        let date = DateTime.fromFormat(e.target.value, format);

        if (value && this.keepDate) {
            date = date.set({
                year: value.year,
                month: value.month,
                day: value.day,
            });
        }
        if (value && this.keepTime) {
            date = date.set({
                hour: value.hour,
                minute: value.minute,
                second: value.second,
                millisecond: value.millisecond,
            });
        }

        if (!date.invalid) {
            onChange(date);
        }
    }

    onBlur(...args) {
        const { onBlur } = this.props;
        this.setState({ typeValue: null });
        if (onBlur) {
            onBlur(...args);
        }
    }

    renderInput(ref, { inputRef, ...props }) {
        return (
            <Input
                ref={(node) => {
                    if (inputRef) {
                        inputRef(node);
                    }
                    let domNode = ReactDOM.findDOMNode(node);
                    if (domNode) {
                        domNode = domNode.getElementsByTagName('input')[0];
                    }
                    return ref(domNode);
                }}
                {...props}
            />
        );
    }

    render() {
        const { typeValue, autoCorrectedDatePipe } = this.state; 
        const { format, value, innerRef, ...props } = this.props;

        delete props.onChange;
        delete props.onBlur;

        if (autoCorrectedDatePipe !== null) {
            return (
                <MaskedInput
                    mask={masks[formats[format]]}
                    pipe={autoCorrectedDatePipe}
                    value={
                        typeValue !== null
                        ? typeValue
                        : value
                        ? value.toFormat(format)
                        : ''
                    }
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    keepCharPositions={true}
                    guide={true}
                    inputRef={innerRef}
                    render={this.renderInput}
                    {...props}
                />
            );
        } else {
            return ( 
                <Input
                    value={
                        typeValue !== null
                        ? typeValue
                        : value
                        ? value.toFormat(format)
                        : ''
                    }
                    ref={innerRef}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    {...props}
                />
            );
        }
    }
}
