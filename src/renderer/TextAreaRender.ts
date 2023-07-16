import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { helpMessage } from "src/util/helpMessage";

export default class TextAreaRender implements Render {
    private element:HTMLTextAreaElement ;
    private rowElement:HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLTextAreaElement;
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

    reset() {
        this.element.value = '';
    }

    getElement(): HTMLElement {
        return this.element;
    }

    valid(): any {

        const validResult = stringValidator(this.getValue(), this.field);

        helpMessage(this.field, this.rowElement, validResult);
        
        return validResult;
    }

}