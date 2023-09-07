export declare const RULES: {
    readonly NAN: "nan";
    readonly MIN: "minimum";
    readonly EXCLUSIVE_MIN: "exclusiveMinimum";
    readonly MAX: "maximum";
    readonly EXCLUSIVE_MAX: "exclusiveMaximum";
    readonly MIN_LENGTH: "minLength";
    readonly MAX_LENGTH: "maxLength";
    readonly BETWEEN: "between";
    readonly BETWEEN_EXCLUSIVE_MIN: "betweenExclusiveMin";
    readonly BETWEEN_EXCLUSIVE_MAX: "betweenExclusiveMax";
    readonly BETWEEN_EXCLUSIVE_MINMAX: "betweenExclusiveMinMax";
    readonly REGEXP: "regexp";
    readonly REQUIRED: "required";
    readonly VALIDATOR: "validator";
};
export declare const FIELD_PREFIX = "dff";
export declare const RENDER_TEMPLATE: any;
export declare const TEXT_ALIGN: {
    readonly left: "left";
    readonly center: "center";
    readonly right: "right";
};
export type TEXT_ALIGN_TYPE = (typeof TEXT_ALIGN)[keyof typeof TEXT_ALIGN];
export type FORM_FIELD_TYPE = "number" | "string" | "array";
export type RENDER_TYPE = "number" | "text" | "file" | "textarea" | "dropdown" | "radio" | "checkbox" | "date" | "group" | "custom";
export type REGEXP_TYPE = "email" | "url" | "alpha" | "alpha-num";
export type PASSWORD_TYPE = "number" | "upper" | "upper-special" | "upper-special-number";
export type FIELD_POSITION = "top" | "left" | "left-left" | "left-right" | "right" | "right-left" | "right-right" | "bottom";
export type ORIENTATION_TYPE = "horizontal" | "vertical";
interface StringArrayMap {
    [key: string]: string[];
}
export declare const FIELD_POSITION_STYLE: StringArrayMap;
export {};
