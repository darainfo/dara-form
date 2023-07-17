import { FormField } from "@t/FormField";
import { Render } from "./Render";
export default class TextRender implements Render {
    private element;
    private rowElement;
    private field;
    constructor(field: FormField, rowElement: HTMLElement);
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLInputElement;
    valid(): any;
}