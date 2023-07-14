import { FormField } from "@t/FormField";

import NumberRender from "./renderer/NumberRender";
import TextAreaRender from "./renderer/TextAreaRender";
import DropdownRender from "./renderer/DropdownRender";
import TextRender from "./renderer/TextRender";
import CheckboxRender from "./renderer/CheckboxRender";
import RadioRender from "./renderer/RadioRender";
import PasswordRender from "./renderer/PasswordRender";
import { Render } from "./renderer/Render";

export const RENDER_TEMPLATE: any = {
    'number': NumberRender
    , 'textarea': TextAreaRender
    , 'dropdown': DropdownRender
    , 'checkbox': CheckboxRender
    , 'radio': RadioRender
    , 'text': TextRender
    , 'password': PasswordRender
};

export const getRenderer = (field: FormField): Render => {
    let renderType = field.renderType;
    if (!renderType) {
        renderType = field.type == 'number' ? 'number' : 'text';
    }

    let render = RENDER_TEMPLATE[renderType];

    return (render ? render : RENDER_TEMPLATE['text']);
}

export const getRenderTemplate = (field: FormField): string => {
    let render = getRenderer(field) as any;

    return render.template(field);
}