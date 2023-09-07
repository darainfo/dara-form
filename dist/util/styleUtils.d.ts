import { FieldStyle, FormField } from "@t/FormField";
import { FormOptions } from "@t/FormOptions";
declare const _default: {
    /**
     * field style 처리
     *
     * @param formOptions FormOptions
     * @param field FormField
     * @param beforeField FormField
     * @returns FieldStyle
     */
    fieldStyle(formOptions: FormOptions, field: FormField, beforeField?: FormField | null): FieldStyle;
};
export default _default;
