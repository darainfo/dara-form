import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { numberValidator } from "src/rule/numberValidator";
import { helpMessage } from "src/util/helpMessage";

export default class NumberRender implements Render {
    private element:HTMLInputElement;
    private rowElement:HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
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
        const validResult = numberValidator(this.getValue(), this.field);

        helpMessage(this.field, this.rowElement, validResult);
        
        return validResult;
    }

}