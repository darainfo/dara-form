import { FormField } from "@t/FormField";
import Render from "./Render";
export default class DropdownRender implements Render {
    private element;
    private rowElement;
    private field;
    private defaultCheckValue;
    constructor(field: FormField, rowElement: HTMLElement);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLElement;
    valid(): any;
}
