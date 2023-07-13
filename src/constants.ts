import NumberRender from "./renderer/NumberRender";
import TextAreaRender from "./renderer/TextAreaRender";
import DropdownRender from "./renderer/DropdownRender";
import TextRender from "./renderer/TextRender";
import CheckboxRender from "./renderer/CheckboxRender";
import RadioRender from "./renderer/RadioRender";
import PasswordRender from "./renderer/PasswordRender";
import { Render } from "./renderer/Render";

interface Map<K, V> {

}

export const RENDER_TEMPLATE = {
    'number': NumberRender
    , 'textarea': TextAreaRender
    , 'dropdown': DropdownRender
    , 'checkbox': CheckboxRender
    , 'radio': RadioRender
    , 'text': TextRender
    , 'password': PasswordRender
} as Map<string, Render>
