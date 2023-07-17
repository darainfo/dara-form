import { FormField } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, setInvalidMessage } from "src/util/validUtil";
import { dropdownChangeEvent } from "src/util/renderEvents";

export default class DropdownRender implements Render {
    private element: HTMLSelectElement;
    private rowElement: HTMLElement;
    private field;
    private defaultCheckValue;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLSelectElement;

        this.defaultCheckValue = this.field.value[0].value;

        this.field.value.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue = val.value;
            }
        });

        this.initEvent();
    }

    initEvent() {
        dropdownChangeEvent(this.element, this);
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
        this.setValue(this.defaultCheckValue);
        resetRowElementStyleClass(this.rowElement);
    }

    getElement(): HTMLElement {
        return this.element;
    }

    valid(): any {

        const value = this.getValue();

        let validResult: ValidResult | boolean = true;

        if (this.field.required) {
            if (value.length < 1) {
                validResult = { name: this.field.name, constraint: [] };
                validResult.constraint.push(RULES.REQUIRED);
            }
        }

        setInvalidMessage(this.field, this.rowElement, validResult);

        return true;
    }
}