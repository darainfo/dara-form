import { FormField } from "@t/FormField";
import Render from "./Render";
import { numberValidator } from "src/rule/numberValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { inputEvent, numberInputEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class NumberRender extends Render {
    private element: HTMLInputElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm, rowElement);
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
        this.initEvent();
    }

    initEvent() {
        numberInputEvent(this.field, this.element, this);
    }

    static template(field: FormField): string {
        return `
        <div class="dara-form-field">
            <input type="number" name="${field.name}" class="form-field number help-icon" /></i>
        </div> 
        <div class="help-message"></div>
       `;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.field.$value = value;
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
        const validResult = numberValidator(this.getValue(), this.field);

        invalidMessage(this.field, this.rowElement, validResult);

        return validResult;
    }

}