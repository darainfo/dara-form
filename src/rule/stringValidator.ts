import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import util from "src/util/util";
import { validator } from "./validator";


/**
 * string validator
 *
 * @param {string} value
 * @param {FormField} field
 * @returns {(ValidResult | boolean)}
 */
export const stringValidator = (value: string, field: FormField): ValidResult | boolean => {
    let result: ValidResult = { name: field.name, constraint: [] };

    if (field.required && util.isBlank(value)) {
        result.constraint.push(RULES.REQUIRED);
        return result;
    }
    const validResult = validator(value, field, result);
    if (validResult !== true) {
        return validResult;
    }

   

    const rule = field.rule;

    console.log(rule)
    if (rule) {
        const valueLength = value.length;

        const isMinNumber = util.isNumber(rule.minLength)
            , isMaxNumber = util.isNumber(rule.maxLength);

        let minRule = false, maxRule = false;
        if (isMinNumber && valueLength <= rule.minLength) {
            minRule = true;
        }
        if (isMaxNumber && valueLength >= rule.maxLength) {
            maxRule = true;
        }

        if ((isMinNumber && isMaxNumber) && (minRule || maxRule)) {
            result.constraint.push(RULES.BETWEEN);
        } else {
            if (minRule) {
                result.constraint.push(RULES.MIN_LENGTH);
            }

            if (maxRule) {
                result.constraint.push(RULES.MAX_LENGTH);
            }
        }
    }

    if (result.constraint.length > 0) {
        return result;
    }

    return true;
}