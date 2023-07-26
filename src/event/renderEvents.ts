import { FormField } from "@t/FormField";
import Render from "src/renderer/Render";

export const inputEvent = (field: FormField, element: Element, renderInfo: Render) => {
    element.addEventListener('input', (e: Event) => {
        customChangeEventCall(field, e, renderInfo);
        renderInfo.valid();
    })
}

export const numberInputEvent = (field: FormField, element: Element, renderInfo: Render) => {
    element.addEventListener('input', (e: any) => {

        // 숫자 e체크 copy page 체크. 

        customChangeEventCall(field, e, renderInfo);
        renderInfo.valid();
    })
}

export const dropdownChangeEvent = (field: FormField, element: Element, renderInfo: Render) => {
    element.addEventListener('change', (e: Event) => {
        customChangeEventCall(field, e, renderInfo);
        renderInfo.valid();
    })
}

export const customChangeEventCall = (field: FormField, e: Event, renderInfo: Render) => {
    renderInfo.changeEventCall(field, e, renderInfo);
}
