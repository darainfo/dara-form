import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

export const stringCheck = (value: string, field: FormField): ValidResult | boolean => {
    const rule = field.rule;

    if (rule) {
        const result: ValidResult = { name: field.name };
        const valueLength = value.length;

        if (field.required && valueLength < 1) {
            result.constraint = RULES.REQUIRED;
        }

        if (valueLength < rule.minLength) {
            result.constraint = RULES.MIN_LENGTH;
        }

        if (valueLength < rule.maxLength) {
            result.constraint = RULES.MAX_LENGTH;
        }
        return result;
    }

    return true;
}