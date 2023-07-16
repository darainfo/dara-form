import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { helpMessage } from "src/util/helpMessage";

export default class DropdownRender implements Render {
    private element:HTMLSelectElement;
    private rowElement:HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement; 
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLSelectElement;

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

    reset() {
        this.element.value = '';
    }

    getElement(): HTMLElement {
        return this.element;
    }

    valid(): any {
        const value = this.getValue();

        if (this.field.required) {
            if (value) {
                return true;
            }
            const validResult: ValidResult = { name: this.field.name , constraint:[] };
            validResult.constraint.push(RULES.REQUIRED);
            
            helpMessage(this.field, this.rowElement, validResult);
        }

        return true;
    }
}