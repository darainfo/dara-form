import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { inputEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class TextAreaRender extends Render {
  private element: HTMLTextAreaElement;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(
      `[name="${field.$xssName}"]`
    ) as HTMLTextAreaElement;
    this.initEvent();
    this.setDefaultInfo();
  }

  initEvent() {
    inputEvent(this.field, this.element, this);
  }

  static template(field: FormField): string {
    const desc = field.description ? `<div>${field.description}</div>` : "";

    let rows = field.customOptions?.rows;
    rows = +rows > 0 ? rows : 3;

    return `
            <div class="df-field">
                <textarea name="${field.name}" rows="${rows}" class="form-field textarea help-icon"></textarea>
            </div> 
            ${desc}
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
    this.setValue("");
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
