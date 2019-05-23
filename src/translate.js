export function objectLookup(translations) {
    return (key) => {
        const parts = key.split('.');
        let node = translations;
        for (const part of parts) {
            if (typeof node !== 'object') {
                return key;
            }
            node = node[part];
        }
        return node || key;
    };
}

let translate = objectLookup({
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
});

export function configureTranslation(translationFunction) {
    if (typeof translateFunction === 'object') {
        translationFunction = objectLookup(translationFunction);
    }
    translate = translationFunction;
}

export default translate;
