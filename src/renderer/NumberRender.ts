import { FormField } from "@t/FormField";
import { Render } from "./Render";

export default class NumberRender implements Render {
    private element;
    private field;
    constructor(field: FormField, element: HTMLInputElement) {
        this.field = field;
        this.element = element;
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


}