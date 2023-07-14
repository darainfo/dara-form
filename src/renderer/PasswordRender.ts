import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { stringCheck } from "src/rule/stringRule";

export default class PasswordRender implements Render {
    private element;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.element = rowElement.querySelector(`[name="${field.name}"]`) as HTMLInputElement;
    }

    static template(field: FormField): string {
        return `<input type="password" name="${field.name}" class="form-field password" />`;
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
        // TODO 처리 할것. 
        stringCheck(this.getValue(), this.field);
        return true;
    }
}