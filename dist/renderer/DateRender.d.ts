import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
import "dara-datetimepicker/dist/dara.datetimepicker.min.css";
export default class DateRender extends Render {
    private element;
    private dateObj;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLInputElement;
    valid(): any;
}
