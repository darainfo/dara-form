import { FormField } from "@t/FormField";
import { Render } from "./Render";

export default class TextAreaRender implements Render {
    private element;
    private field;
    constructor(field: FormField, element: HTMLTextAreaElement) {
        this.field = field;
        this.element = element;
    }

    static template(field: FormField): string {
        return `<textarea name="${field.name}" class="form-field textarea"></textarea>`;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }


}