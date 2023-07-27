import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";

export default class GroupRender extends Render {

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm, field, rowElement);
    }

    public initEvent() { }

    static template(field: FormField): string {
        return '';
    }

    getValue() {
        return null;
    }

    setValue(value: any): void {

    }

    reset() {

    }

    getElement(): HTMLElement {
        return this.rowElement;
    }

    valid(): any {
        return true;
    }


}