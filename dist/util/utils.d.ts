import { FormField } from "@t/FormField";
declare const _default: {
    replace(inputText: string): string;
    unReplace(inputText: string): string;
    unFieldName(fieldName: string): string;
    isBlank(value: any): boolean;
    isUndefined(value: any): value is undefined;
    isFunction(value: any): boolean;
    isString(value: any): value is string;
    isNumber(value: any): value is number;
    isArray(value: any): boolean;
    replaceXssField(field: FormField): FormField;
    getHashCode(str: string): number;
    isHiddenField(field: FormField): boolean;
};
export default _default;
