import { FielInfo, FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * file validator
 *
 * @param {HTMLInputElement} element
 * @param {FormField} field
 * @param {FielInfo[]} fileList
 * @returns {(ValidResult | boolean)}
 */
export declare const fileValidator: (element: HTMLInputElement, field: FormField, fileList: FielInfo[]) => ValidResult | boolean;
