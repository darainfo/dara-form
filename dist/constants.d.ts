export declare const RULES: {
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
export declare const RENDER_TEMPLATE: any;
export type FORM_FIELD_TYPE = 'number' | 'string' | 'array';
export type RENDER_TYPE = 'number' | 'text' | 'file' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'group' | 'custom';
export type REGEXP_TYPE = 'email' | 'url' | 'alpha' | 'alpha-num';
