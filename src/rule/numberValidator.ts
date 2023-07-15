import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import Lanauage from 'src/util/Lanauage';

export const numberValidator = (value: string, field: FormField): ValidResult | boolean => {
    const rule = field.rule;

    if (rule) {
        const result: ValidResult = { name: field.name , constraint:[] };
        const numValue = Number(value);

        if (field.required && (value.length < 1 || isNaN(numValue) ) ) {
            result.constraint.push(RULES.REQUIRED);
        }

        if (numValue < rule.min) {
            result.constraint.push(RULES.MIN);
        }

        if (numValue > rule.max) {
            result.constraint.push(RULES.MAX);
        }
        
        if(result.constraint.length > 0){
            return result;
        }
    }

    return true;
}