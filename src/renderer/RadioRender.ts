import { FormField } from "@t/FormField";
import { Render } from "./Render";
import XssUtil from "src/util/util";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

let elementIdx = 0;
export default class RadioRender implements Render {
    private rowElement: HTMLElement;
    private field;
    private defaultCheckValue;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.defaultCheckValue = this.field.value[0].value;

        this.field.value.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue = val.value;
            }
        });
    }

    static template(field: FormField): string {
        const templates: string[] = [];
        const fieldName = field.name;
        templates.push(`<div class="field-group">`);
        field.value.forEach((val) => {
            elementIdx += 1;
            const id = `${fieldName}-${elementIdx}`;

            templates.push(
                `<span class="field ${field.viewMode == 'vertical' ? "vertical" : "horizontal"}">
                <label>
                    <input type="radio" name="${fieldName}" value="${val.value}" class="form-field radio" ${val.selected ? 'checked' : ''} />
                    ${val.label}
                </label>
                </span>
                `
            )
        })
        templates.push(`</div>`);

        return templates.join('');
    }

    getValue() {
        return (this.rowElement.querySelector(`[name="${this.field.$xssName}"]:checked`) as HTMLInputElement)?.value;
    }

    setValue(value: any): void {
        this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${value}"]`)?.setAttribute("checked", "checked");
    }

    reset() {
        this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`).forEach(item => {
            (item as HTMLInputElement).checked = false;
        })

        this.setValue(this.defaultCheckValue);
    }

    getElement(): any {
        return this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`);
    }

    valid(): any {
        const value = this.getValue();

        if (this.field.required) {
            if (value) {
                return true;
            }
            const result: ValidResult = { name: this.field.name, constraint:[] };
            result.constraint.push(RULES.REQUIRED);
            return result;
        }

        return true;
    }

}