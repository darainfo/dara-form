import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
export declare const invalidMessage: (field: FormField, rowElement: Element, validResult: ValidResult | boolean) => void;
/**
 * remove row element style class
 *
 * @param {Element} rowElement
 */
export declare const resetRowElementStyleClass: (rowElement: Element) => void;
