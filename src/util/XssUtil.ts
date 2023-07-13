const xssFilter = {
    "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , "\"": "&quot;"
    , "'": "&#39;"
} as any;

export default {

    replaceXSS(inputText: string): string {
        let returnText = inputText;
        if (returnText) {
            Object.keys(xssFilter).forEach((key) => {
                returnText = returnText.replaceAll(key, xssFilter[key]);
            })
        }
        return returnText;
    }

    , unReplaceXSS(inputText: string): string {
        let returnText = inputText;

        if (returnText) {
            Object.keys(xssFilter).forEach((key) => {
                returnText = returnText.replaceAll(xssFilter[key], key);
            })
        }
        return returnText;
    }
}