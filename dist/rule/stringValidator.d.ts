import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * string validator
 *
 * @param {string} value
 * @param {FormField} field
 * @returns {(ValidResult | boolean)}
 */
export declare const stringValidator: (value: string, field: FormField) => ValidResult | boolean;
