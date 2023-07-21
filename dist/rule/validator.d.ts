import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 *  validator  ,  regexp 체크 .
 *
 * @param {string} value field value
 * @param {FormField} field field 정보
 * @param {ValidResult} result
 * @returns {(ValidResult | boolean)}
 */
export declare const validator: (value: string, field: FormField, result: ValidResult) => ValidResult | boolean;
