import { FormField } from "@t/FormField";
import Render from "./Render";
import { numberValidator } from "src/rule/numberValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { numberInputEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class NumberRender extends Render {
  private element: HTMLInputElement;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    this.mounted();
    this.setDefaultOption();
    this.setDefaultInfo();
  }

  mounted() {
    numberInputEvent(this.field, this.element, this);
  }

  createField() {
    const field = this.field;

    const fieldContainerElement = this.rowElement.querySelector(".df-field-container") as HTMLElement;

    fieldContainerElement.innerHTML = `
        <div class="df-field">
            <input type="text" name="${field.$xssName}" class="form-field number help-icon" />
        </div> 
        ${Render.getDescriptionTemplate(field)}
        <div class="help-message"></div>
       `;
    this.element = fieldContainerElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: any, changeCheckFlag?: boolean): void {
    if (changeCheckFlag !== false && this.changeEventCall(this.field, null, this, value) === false) {
      this.element.value = this.field.$value;
      return;
    }
    this.field.$value = value;
    this.element.value = value;
  }

  reset() {
    this.setDefaultInfo();
    this.setDisabled(false);
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
