import { FielInfo, FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import FileRender from "src/renderer/FileRender";
import util from "src/util/util";

export const fileValidator = (element: HTMLInputElement, field: FormField, fileList: FielInfo[]): ValidResult | boolean => {
    const result: ValidResult = { name: field.name, constraint: [] };

    if (field.required && element.files && element.files.length < 1) {
        if (fileList.length < 1) {
            result.constraint.push(RULES.REQUIRED);
        }
    }

    const rule = field.rule;
    if (rule) {
        /*
        const valueLength = value.length;

        if (valueLength < rule.minLength) {
            result.constraint.push(RULES.MIN_LENGTH);
        }

        if (valueLength > rule.maxLength) {
            result.constraint.push(RULES.MAX_LENGTH);
        }
        */
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}