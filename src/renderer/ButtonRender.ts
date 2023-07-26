import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { inputEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class ButtonRender extends Render {

  private field;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, rowElement);
    this.field = field;
    this.rowElement = rowElement;
    this.initEvent();
  }

  initEvent() {
    // inputEvent(this.field, this.element, this);
  }

  static template(field: FormField): string {
    return `
      <button type="button" class="df-btn">${field.label}</button>
     `;
  }

  getValue() {
    return '';
  }

  setValue(value: any): void {

  }

  reset() {

  }

  getElement() {
    return null;
  }

  valid(): any {
    return true;
  }
}
