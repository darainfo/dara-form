import { FormField } from "@t/FormField";
import { ValidResult } from '../types/ValidResult';

const xssFilter = {
    "&": "&amp;"
    , "<": "&lt;"
    , ">": "&gt;"
    , "\"": "&quot;"
    , "'": "&#39;"
} as any;

export default {

    replace(inputText: string): string {
        let returnText = inputText;
        if (returnText) {
            Object.keys(xssFilter).forEach((key) => {
                returnText = returnText.replaceAll(key, xssFilter[key]);
            })
        }
        return returnText;
    }

    , unReplace(inputText: string): string {
        let returnText = inputText;

        if (returnText) {
            Object.keys(xssFilter).forEach((key) => {
                returnText = returnText.replaceAll(xssFilter[key], key);
            })
        }
        return returnText;
    }

    , unFieldName(fieldName: string): string {
        if (fieldName) {
            return this.unReplace(fieldName).replaceAll("\"", "\\\"");
        }

        return '';

    }

    ,isEmpty(value:any):boolean {
        if (value === null) return true;
        if (typeof value === 'undefined') return true;
        if (typeof value === 'string' && (value === '' || value.replace(/\s/g,'')==='')) return true;

        return false; 
    }
}