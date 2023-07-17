import { DataMap } from "@t/DataMap";
import utils from './util';
import Render from "src/renderer/Render";

const instanceMap = new Map();

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

export const fileChangeEvent = (element: Element, rederInfo: Render) => {
    element.addEventListener('change', (e: Event) => {
        rederInfo.valid();
    })
}
