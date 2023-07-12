import { FormField } from "@t/FormField";
import NumberRender from "./renderer/NumberRender";
import TextAreaRender from "./renderer/TextAreaRender";
import DropdownRender from "./renderer/DropdownRender";
import TextRender from "./renderer/TextRender";
import CheckboxRender from "./renderer/CheckboxRender";
import RadioRender from "./renderer/RadioRender";
import PasswordRender from "./renderer/PasswordRender";

const renderTemlate = {
    'number': NumberRender
    , 'textarea': TextAreaRender
    , 'dropdown': DropdownRender
    , 'checkbox': CheckboxRender
    , 'radio': RadioRender
    , 'text': TextRender
    , 'password': PasswordRender
} as any;

export const fieldTemplate = (field: FormField) => {
    let renderType = field.renderType;
    if (!renderType) {
        renderType = field.type == 'number' ? 'number' : 'text';
    }

    if (renderTemlate[renderType]) {
        return renderTemlate[renderType].template(field);
    }

    return TextRender.template(field);
}