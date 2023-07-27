import { FormField } from "@t/FormField";
import Render from "src/renderer/Render";
export declare const inputEvent: (field: FormField, element: Element, renderInfo: Render) => void;
export declare const numberInputEvent: (field: FormField, element: HTMLInputElement, renderInfo: Render) => void;
export declare const dropdownChangeEvent: (field: FormField, element: Element, renderInfo: Render) => void;
export declare const customChangeEventCall: (field: FormField, e: Event, renderInfo: Render) => void;
