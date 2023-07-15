import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

export const stringValidator = (value: string, field: FormField): ValidResult | boolean => {
    const rule = field.rule;

    if (rule) {
        const result: ValidResult = { name: field.name, constraint:[] };
        const valueLength = value.length;

        if (field.required && valueLength < 1) {
            result.constraint.push(RULES.REQUIRED);
        }

        if (valueLength < rule.minLength) {
            result.constraint.push(RULES.MIN_LENGTH);
        }

        if (valueLength > rule.maxLength) {
            result.constraint.push(RULES.MAX_LENGTH);
        }

        if(result.constraint.length > 0){
            return result;
        }

    }

    return true;
}