import { FormField } from "@t/FormField";
import Render from "./Render";
export default class CustomRender implements Render {
    private rowElement;
    private field;
    private customFunction;
    constructor(field: FormField, rowElement: HTMLElement);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): any;
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): any;
}
