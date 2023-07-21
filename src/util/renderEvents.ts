import Render from "src/renderer/Render";

export const inputEvent = (element: Element, rederInfo: Render) => {
    element.addEventListener('input', (e: Event) => {
        rederInfo.valid();
    })
}

export const dropdownChangeEvent = (element: Element, rederInfo: Render) => {
    element.addEventListener('change', (e: Event) => {
        rederInfo.valid();
    })
}
