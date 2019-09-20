interface TranslationArgs {
    [key: string]: any
}
export type TranslationFn = (key: string, args?: TranslationArgs) => string;
type InnerTranslationFn = (args: TranslationArgs) => string;
interface Translations {
    [key: string]: Translations | string | InnerTranslationFn;
}

export function objectLookup(translations: Translations): TranslationFn {
    return (key, args = {}) => {
        let node: Translations | string | InnerTranslationFn = translations;
        for (const part of key.split('.')) {
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

export let translate: TranslationFn = objectLookup({
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
});

export function configureTranslation(func: Translations | TranslationFn) {
    translate = typeof func === "object" ? objectLookup(func) : func;
}
