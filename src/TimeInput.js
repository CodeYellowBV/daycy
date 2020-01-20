import DateInput from './DateInput';

export default class TimeInput extends DateInput {  
    static defaultProps = {
        ...DateInput.defaultProps,
        format: 'H:mm',
    };
}
