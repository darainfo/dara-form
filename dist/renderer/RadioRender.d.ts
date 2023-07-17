import { FormField } from "@t/FormField";
import { Render } from "./Render";
export default class RadioRender implements Render {
    private rowElement;
    private field;
    private defaultCheckValue;
    constructor(field: FormField, rowElement: HTMLElement);
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): any;
}
