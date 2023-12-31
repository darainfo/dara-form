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
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.initEvent();
    this.setDefaultOption();
    this.setDefaultInfo();
  }

  initEvent() {
    numberInputEvent(this.field, this.element, this);
  }

  static template(field: FormField): string {
    return `
        <div class="df-field">
            <input type="text" name="${field.name}" class="form-field number help-icon" />
        </div> 
        ${Render.getDescriptionTemplate(field)}
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
