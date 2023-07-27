import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import DaraForm from "src/DaraForm";
export default abstract class Render {
    protected daraForm: DaraForm;
    protected rowElement: HTMLElement;
    constructor(form: DaraForm, rowElement: HTMLElement);
    getForm(): DaraForm;
    abstract initEvent(): void;
    abstract getValue(): any;
    abstract setValue(value: any): void;
    abstract reset(): void;
    abstract getElement(): any;
    abstract valid(): ValidResult | boolean;
    setValueItems(value: any): void;
    changeEventCall(field: FormField, e: Event, rederInfo: Render): void;
    focus(): void;
    show(): void;
    hide(): void;
}
