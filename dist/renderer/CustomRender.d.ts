import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class CustomRender extends Render {
    private customFunction;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): any;
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): any;
}
