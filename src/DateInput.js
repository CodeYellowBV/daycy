import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'semantic-ui-react';
import { DateTime } from 'luxon';

export default class DateInput extends Component {
    static propTypes = {
        format: PropTypes.string,
        value: PropTypes.instanceOf(DateTime),
        onChange: PropTypes.func.isRequired,
    };

    static defaultProps = {
        format: 'dd-LL-yyyy',
    };

    state = { value: null, typeValue: null };

    constructor(...args) {
        super(...args);
        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChange(e, { value }) {
        const { format, onChange } = this.props;

        this.setState({ typeValue: value });

        const date = DateTime.fromFormat(value, format);
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

    render() {
        const { typeValue } = this.state; 
        const { format, value, ...props } = this.props;

        delete props.onChange;
        delete props.onBlur;

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
