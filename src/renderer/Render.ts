import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import DaraForm from "src/DaraForm";
import utils from "src/util/utils";

export default abstract class Render {

    protected daraForm;
    protected rowElement;
    protected field;

    constructor(form: DaraForm, field: FormField, rowElement: HTMLElement) {
        this.daraForm = form;
        this.field = field;
        this.rowElement = rowElement;

        if (field.tooltip) rowElement.querySelector('.df-tooltip')?.setAttribute('tooltip', field.tooltip);
    }

    public setDefaultInfo() {

        if (!utils.isUndefined(this.field.defaultValue)) {
            this.setValue(this.field.defaultValue);
        }
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

    public commonRuleCheck() {
        //this.field.diff
    }

}