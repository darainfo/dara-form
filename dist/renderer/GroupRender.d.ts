import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class GroupRender extends Render {
    private field;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): null;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLElement;
    valid(): any;
}
