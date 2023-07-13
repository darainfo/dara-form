import { FormField } from "@t/FormField";
import { RENDER_TEMPLATE } from "./constants";
import { Render } from "./renderer/Render";

export const getRenderTemplate = (field: FormField):  => {
    let renderType = field.renderType;
    if (!renderType) {
        renderType = field.type == 'number' ? 'number' : 'text';
    }

    if (RENDER_TEMPLATE[renderType]) {
        return RENDER_TEMPLATE[renderType];
    }

    return DEFAULT_TEMPLATE;
}