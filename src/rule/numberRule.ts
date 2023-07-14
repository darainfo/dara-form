import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

export const numberRule = (value: string, field: FormField): ValidResult | boolean => {
    const rule = field.rule;

    if (rule) {
        const result: ValidResult = { name: field.name };
        const numValue = Number(value);

        if (field.required && typeof Number(value)) {
            result.constraint = RULES.REQUIRED;
        }

        if (numValue < rule.min) {
            result.constraint = RULES.MIN;
        }

        if (numValue < rule.max) {
            result.constraint = RULES.MAX;
        }
        return result;
    }

    return true;
}