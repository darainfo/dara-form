import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import DaraForm from "src/DaraForm";
import utils from "src/util/utils";
import TextRender from "./TextRender";
import TextAreaRender from "./TextAreaRender";

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

        if (!utils.isUndefined(this.field.placeholder)) {
            const ele = this.getElement();
            if (ele instanceof Element) {
                ele.setAttribute("placeholder", this.field.placeholder);
            }
        }
    }

    public setPlaceholder() {



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

    public commonValidator() {
        //this.field.diff
    }

}