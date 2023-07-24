import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import DaraForm from "src/DaraForm";

export default abstract class Render {

    private daraForm;
    constructor(form: DaraForm) {
        this.daraForm = form;
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

    public setValueItems(value: any): void {

    };

    public changeEventCall(field: FormField, e: Event, rederInfo: Render) {
        if (field.onChange) {
            field.onChange.call(null, {
                field: field,
                evt: e,
                value: rederInfo.getValue()
            });
        }
    }

    public focus() {
        this.getElement().focus();
    }
}