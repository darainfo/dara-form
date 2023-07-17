import { FormField } from "@t/FormField";
import { Render } from "./Render";
export default class TextAreaRender implements Render {
    private element;
    private rowElement;
    private field;
    constructor(field: FormField, rowElement: HTMLElement);
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLElement;
    valid(): any;
}
