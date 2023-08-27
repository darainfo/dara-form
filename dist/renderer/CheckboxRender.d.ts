import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class CheckboxRender extends Render {
    private defaultCheckValue;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    getSelector(): string;
    static template(field: FormField): string;
    setValueItems(items: any): void;
    getValue(): string | boolean | any[];
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): any;
}
