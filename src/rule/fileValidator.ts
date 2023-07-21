import { FielInfo, FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";


/**
 * file validator 
 *
 * @param {HTMLInputElement} element
 * @param {FormField} field
 * @param {FielInfo[]} fileList
 * @returns {(ValidResult | boolean)}
 */
export const fileValidator = (element: HTMLInputElement, field: FormField, fileList: FielInfo[]): ValidResult | boolean => {
    const result: ValidResult = { name: field.name, constraint: [] };

    if (field.required && element.files && element.files.length < 1) {
        if (fileList.length < 1) {
            result.constraint.push(RULES.REQUIRED);
            return result;
        }
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}