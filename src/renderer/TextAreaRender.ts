import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtil";
import { inputEvent } from "src/util/renderEvents";

export default class TextAreaRender implements Render {
    private element: HTMLTextAreaElement;
    private rowElement: HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLTextAreaElement;
        this.initEvent();
    }

    initEvent() {
        inputEvent(this.element, this);
    }

    static template(field: FormField): string {

        return `
            <div class="dara-form-field">
            <textarea name="${field.name}" class="form-field textarea help-icon"></textarea>
            </div> 
        `;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }

    reset() {
        this.setValue('');
        resetRowElementStyleClass(this.rowElement);
    }

    getElement(): HTMLElement {
        return this.element;
    }

    valid(): any {

        const validResult = stringValidator(this.getValue(), this.field);

        invalidMessage(this.field, this.rowElement, validResult);

        return validResult;
    }

}