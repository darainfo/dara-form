import NumberRender from "src/renderer/NumberRender";
import TextAreaRender from "src/renderer/TextAreaRender";
import DropdownRender from "src/renderer/DropdownRender";
import TextRender from "src/renderer/TextRender";
import CheckboxRender from "src/renderer/CheckboxRender";
import RadioRender from "src/renderer/RadioRender";
import PasswordRender from "src/renderer/PasswordRender";
import FileRender from "src/renderer/FileRender";

export const RULES = {
    MIN: 'min',
    MAX: 'max',
    MIN_LENGTH: 'minLength',
    MAX_LENGTH: 'maxLength',
    PATTERN: 'pattern',
    REQUIRED: 'required',
} as const;


export const RENDER_TEMPLATE: any = {
    'number': NumberRender
    , 'textarea': TextAreaRender
    , 'dropdown': DropdownRender
    , 'checkbox': CheckboxRender
    , 'radio': RadioRender
    , 'text': TextRender
    , 'password': PasswordRender
    , 'file': FileRender
};

export type FORM_FIELD_TYPE = 'number' | 'string' | 'array';

export type RENDER_TYPE = 'number' | 'text' | 'file' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'group';

export type VALIDATORS = 'email' | 'url' | 'alpha' | 'alpha-num';