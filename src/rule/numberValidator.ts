import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import util from "src/util/util";
import { validator } from "./validator";

export const numberValidator = (value: string, field: FormField): ValidResult | boolean => {
    const result: ValidResult = { name: field.name, constraint: [] };
    const numValue = Number(value);

    if (field.required && (!util.isNumber(value))) {
        result.constraint.push(RULES.REQUIRED);
        return result;
    }

    if (validator(value, field, result) !== true) {
        return result;
    }

    const rule = field.rule;
    if (rule) {

        const isMinimum = util.isNumber(rule.minimum)
            , isMaximum = util.isNumber(rule.maximum);

        let minRule = false, minExclusive = false, maxRule = false, maxExclusive = false;

        if (isMinimum) {
            if (rule.exclusiveMinimum && numValue < rule.minimum) {
                minExclusive = true;
            } else if (numValue <= rule.minimum) {
                minRule = true;
            }
        }

        if (isMaximum) {
            if (rule.exclusiveMaximum && numValue > rule.maximum) {
                maxExclusive = true;
            } else if (numValue >= rule.maximum) {
                maxRule = true;
            }
        }

        if ((isMinimum && isMaximum) && (minRule || minExclusive || maxRule || maxExclusive)) {
            if (minExclusive && maxExclusive) {
                result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MINMAX);
            } else if (minExclusive) {
                result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MIN);
            } else if (maxExclusive) {
                result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MAX);
            } else {
                result.constraint.push(RULES.BETWEEN);
            }
        } else {
            if (minExclusive) {
                result.constraint.push(RULES.EXCLUSIVE_MIN);
            }

            if (maxExclusive) {
                result.constraint.push(RULES.EXCLUSIVE_MAX);
            }

            if (minRule) {
                result.constraint.push(RULES.MIN);
            }

            if (maxRule) {
                result.constraint.push(RULES.MAX);
            }
        }
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}