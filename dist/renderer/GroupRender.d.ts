import { FormField } from "@t/FormField";
import Render from "./Render";
export default class GroupRender implements Render {
    private element;
    private field;
    constructor(field: FormField, element: HTMLTextAreaElement);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLElement;
    valid(): any;
}
