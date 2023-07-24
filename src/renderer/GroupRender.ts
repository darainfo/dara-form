import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";

export default class GroupRender extends Render {
    private rowElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm);
        this.field = field;
        this.rowElement = rowElement;
    }

    public initEvent() { }

    static template(field: FormField): string {
        let template = `<select name="${field.name}" class="form-field dropdown">`;

        field.values.forEach(val => {
            template += `<option value="${val.value}" ${val.selected ? 'selected' : ''}>${val.label}</option>`;
        })

        template += `</select>`;
        return template;
    }

    getValue() {
        return null;
    }

    setValue(value: any): void {
        //this.rowElement.value = value;
    }

    reset() {
        //this.rowElement.value = '';
    }

    getElement(): HTMLElement {
        return this.rowElement;
    }

    valid(): any {
        return false;
    }


}