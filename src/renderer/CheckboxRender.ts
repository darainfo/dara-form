import { FormField } from "@t/FormField";
import { Render } from "./Render";
import XssUtil from "src/util/XssUtil";

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

            templates.push(`
                <span class="field ${field.viewMode == 'vertical' ? "vertical" : "horizontal"}">
                    <label>
                        <input type="checkbox" name="${fieldName}" value="${XssUtil.replaceXSS(val.value)}" class="form-field checkbox" />
                        ${val.label}
                    </label>
                </span>
            `);
        })
        templates.push(`< /div>`);

        return templates.join('');
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }


}