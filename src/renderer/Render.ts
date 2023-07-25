import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import DaraForm from "src/DaraForm";

export default abstract class Render {

    protected daraForm;
    protected rowElement;

    constructor(form: DaraForm, rowElement: HTMLElement) {
        this.daraForm = form;
        this.rowElement = rowElement;
    }


    public getForm(): DaraForm {
        return this.daraForm;
    }

    public abstract initEvent(): void;
    public abstract getValue(): any;
    public abstract setValue(value: any): void;
    public abstract reset(): void;
    public abstract getElement(): any;
    public abstract valid(): ValidResult | boolean;

    public setValueItems(value: any): void { };

    public changeEventCall(field: FormField, e: Event, rederInfo: Render) {
        if (field.onChange) {
            field.onChange.call(null, {
                field: field,
                evt: e,
                value: rederInfo.getValue()
            });
        }

        this.daraForm.conditionCheck();
    }

    public focus() {
        this.getElement().focus();
    }

    public show() {
        this.rowElement.classList.remove('df-hidden');
    }

    public hide() {
        if (!this.rowElement.classList.contains('df-hidden')) {
            this.rowElement.classList.add('df-hidden');
        };
    }

}