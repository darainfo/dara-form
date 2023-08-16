import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * 숫자 유효성 체크
 *
 * @param {string} value
 * @param {FormField} field
 * @returns {(ValidResult | boolean)}
 */
export declare const numberValidator: (value: string, field: FormField) => ValidResult | boolean;
