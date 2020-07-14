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

export default class DateInput extends Component {
    static propTypes = {
        format: PropTypes.string,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
    };

    state = {
        value: null,
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

    onChange(e) {
        const { format, onChange } = this.props;

        this.setState({ typeValue: e.target.value });

        const date = DateTime.fromFormat(e.target.value, format);
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

    renderInput(ref, props) {
        return (
            <Input
                ref={(node) => {
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
        const { format, value, ...props } = this.props;

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
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    {...props}
                />
            );
        }
    }
}
