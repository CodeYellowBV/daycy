import DateInput from './DateInput';

export default class MonthInput extends DateInput {
    static defaultProps = {
        ...DateInput.defaultProps,
        format: 'LL-yyyy',
    };
}
