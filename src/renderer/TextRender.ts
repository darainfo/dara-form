import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, setInvalidMessage } from "src/util/validUtil";
import { $dom } from "src/util/domCtrl";
import { inputEvent } from "src/util/renderEvents";

export default class TextRender implements Render {
  private element: HTMLInputElement;
  private rowElement: Element;
  private field;

  constructor(field: FormField, rowElement: HTMLElement) {
    this.field = field;
    this.rowElement = rowElement;
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.initEvent();
  }

  initEvent() {
    inputEvent(this.element, this);
  }

  static template(field: FormField): string {
    return `
    <span class="dara-form-field">
      <input type="text" name="${field.name}" class="form-field text" /> <i class="help-icon"></i>
     </span> 
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

  getElement(): HTMLInputElement {
    return this.element;
  }

  valid(): any {
    const validResult = stringValidator(this.getValue(), this.field);

    setInvalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
