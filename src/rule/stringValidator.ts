import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import util from "src/util/util";
import { regexpValidator } from "./regexpValidator";

export const stringValidator = (value: string, field: FormField): ValidResult | boolean => {
    const result: ValidResult = { name: field.name, constraint: [] };

    if (field.required && util.isEmpty(value)) {
        result.constraint.push(RULES.REQUIRED);
        return result;
    }

    const regexpResult = regexpValidator(value, field);
    if (regexpResult !== true) {
        return regexpResult;
    }

    const rule = field.rule;
    if (rule) {
        const valueLength = value.length;

        if (valueLength < rule.minLength) {
            result.constraint.push(RULES.MIN_LENGTH);
        }

        if (valueLength > rule.maxLength) {
            result.constraint.push(RULES.MAX_LENGTH);
        }
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}