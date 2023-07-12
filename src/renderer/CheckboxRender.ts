import { FormField } from "@t/FormField";
import { Render } from "./Render";

let elementIdx = 0;
export default class CheckboxRender implements Render {
    private element;
    private field;

    constructor(field: FormField, element: HTMLInputElement) {
        this.field = field;
        this.element = element;
    }

    static template(field: FormField): string {
        const templates: string[] = [];
        const fieldName = field.name;

        templates.push(`<div class="field-group">`);
        field.value.forEach((val) => {
            elementIdx += 1;
            const id = `${fieldName}-${elementIdx}`;

            templates.push(
                `<span class="field ${field.viewMode}">
                <input type="checkbox" name="${fieldName}" id="${id}" value="${val.value}" class="form-field checkbox" />
                <label for="${id}">${val.label}</label>
                </span>
                `
            )
        })
        templates.push(`</div>`);

        return templates.join('');
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }


}