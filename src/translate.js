let translate = (key) => key;

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

export function configureTranslate(translateFunction) {
    if (typeof translateFunction === 'object') {
        translateFunction = objectLookup(translateFunction);
    }
    translate = translateFunction;
}

export default translate;
