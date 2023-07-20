import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import util from "src/util/util";

export const numberValidator = (value: string, field: FormField): ValidResult | boolean => {
    const result: ValidResult = { name: field.name, constraint: [] };
    const numValue = Number(value);

    if (field.required && (util.isEmpty(value) || isNaN(numValue))) {
        result.constraint.push(RULES.REQUIRED);
        return result;
    }

    const rule = field.rule;
    if (rule) {
        if (numValue < rule.min) {
            result.constraint.push(RULES.MIN);
        }

        if (numValue > rule.max) {
            result.constraint.push(RULES.MAX);
        }
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}