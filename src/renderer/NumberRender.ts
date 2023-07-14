import { FormField } from "@t/FormField";
import { Render } from "./Render";

export default class NumberRender implements Render {
    private element;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.element = rowElement.querySelector(`[name="${field.name}"]`) as HTMLInputElement;
    }

    static template(field: FormField): string {
        return `<input type="number" name="${field.name}" class="form-field number" />`;
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
        return false;
    }

}