import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class DropdownRender extends Render {
    private element;
    private field;
    private defaultCheckValue;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    static template(field: FormField): string;
    setValueItems(items: any): void;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLElement;
    valid(): any;
}
