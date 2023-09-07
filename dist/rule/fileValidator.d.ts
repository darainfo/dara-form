import { FileInfo, FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * file validator
 *
 * @param {HTMLInputElement} element
 * @param {FormField} field
 * @param {FileInfo[]} fileList
 * @returns {(ValidResult | boolean)}
 */
export declare const fileValidator: (element: HTMLInputElement, field: FormField, fileList: FileInfo[]) => ValidResult | boolean;
