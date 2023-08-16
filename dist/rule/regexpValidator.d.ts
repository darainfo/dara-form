import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * 정규식 유효성 체크.
 *
 * @param {string} value
 * @param {FormField} field
 * @param {(ValidResult | undefined)} result
 * @returns {ValidResult}
 */
export declare const regexpValidator: (value: string, field: FormField, result: ValidResult | undefined) => ValidResult;
