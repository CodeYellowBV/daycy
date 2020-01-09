export function objectLookup(translations) {
    return (key, args = {}) => {
        const parts = key.split('.');
        let node = translations;
        for (const part of parts) {
            if (typeof node !== 'object') {
                return key;
            }
            node = node[part];
        }
        if (typeof node === 'function') {
            node = node(args);
        }
        if (typeof node !== 'string') {
            return key;
        }
        return node;
    };
}

export let translate = null;

export function configureTranslation(translationFunction) {
    if (typeof translationFunction === 'object') {
        translationFunction = objectLookup(translationFunction);
    }
    translate = translationFunction;
}

configureTranslation({
    week: {
        label: 'Wk',
        number: ({ week }) => `${week}`,
        value: ({ year, week }) => `W${week} - ${year}`,
    },
    weekDay: {
        monday: 'Mo',
        tuesday: 'Tu',
        wednesday: 'We',
        thursday: 'Th',
        friday: 'Fr',
        saturday: 'Sa',
        sunday: 'Su',
    },
    month: {
        january: 'January',
        february: 'February',
        march: 'March',
        april: 'April',
        may: 'May',
        june: 'June',
        july: 'July',
        august: 'August',
        september: 'September',
        october: 'October',
        november: 'November',
        december: 'December',
    },
    period: {
        am: 'AM',
        pm: 'PM',
    },
});
