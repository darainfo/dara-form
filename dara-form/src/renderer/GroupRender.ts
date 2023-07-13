import { FormField } from "@t/FormField";
import { Render } from "./Render";

export default class GroupRender implements Render {
    private element;
    private field;
    constructor(field: FormField, element: HTMLTextAreaElement) {
        this.field = field;
        this.element = element;
    }

    static template(field: FormField): string {
        let template = `<select name="${field.name}" class="form-field dropdown">`;

        field.value.forEach(val => {
            template += `<option value="${val.value}" ${val.selected ? 'selected' : ''}>${val.label}</option>`;
        })

        template += `</select>`;
        return template;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }


}