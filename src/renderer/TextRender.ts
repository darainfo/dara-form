import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { Render } from "./Render";
import XssUtil from "src/util/XssUtil";
import { RULES } from "src/constants";
import { stringCheck } from "src/rule/stringRule";

export default class TextRender implements Render {
    private element: HTMLInputElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        const fieldName = XssUtil.unFieldName(field.name);
        this.element = rowElement.querySelector(`[name="${fieldName}"]`) as HTMLInputElement;
    }

    static template(field: FormField): string {
        return `<input type="text" name="${field.name}" class="form-field text" />`;
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

    getElement(): HTMLInputElement {
        return this.element;
    }

    valid(): any {
        return stringCheck(this.getValue(), this.field);
    }
}