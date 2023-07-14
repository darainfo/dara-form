import { FormField } from "@t/FormField";
import { Render } from "./Render";
import XssUtil from "src/util/XssUtil";
import { stringCheck } from "src/rule/stringRule";

export default class TextAreaRender implements Render {
    private element;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        const fieldName = XssUtil.unFieldName(field.name);
        this.element = rowElement.querySelector(`[name="${fieldName}"]`) as HTMLTextAreaElement;
    }

    static template(field: FormField): string {
        return `<textarea name="${field.name}" class="form-field textarea"></textarea>`;
    }

    getValue() {
        console.log(this.element, this.field)
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
        return stringCheck(this.getValue(), this.field);
    }

}