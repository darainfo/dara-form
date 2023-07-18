import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, setInvalidMessage } from "src/util/validUtil";
import { $dom } from "src/util/domCtrl";
import { inputEvent } from "src/util/renderEvents";

export default class CustomRender implements Render {
  private rowElement: Element;
  private field;
  private customFunction;

  constructor(field: FormField, rowElement: HTMLElement) {
    this.field = field;
    this.rowElement = rowElement;
    this.customFunction = field.renderer;
    this.initEvent();
  }

  initEvent() {
    if (this.customFunction.initEvent) {
      (this.customFunction.initEvent as any).call(this, this.field, this.rowElement);
    }
  }

  static template(field: FormField): string {
    if ((field.renderer as any).template) {
      return ` <span class="dara-form-field">${(field.renderer as any).template()}</span>`;
    }
    return '';
  }

  getValue() {
    if (this.customFunction.getValue) {
      return (this.customFunction.getValue as any).call(this, this.field, this.rowElement);
    }
    return '';
  }

  setValue(value: any): void {
    if (this.customFunction.setValue) {
      (this.customFunction.setValue as any).call(this, value, this.field, this.rowElement);
    }
  }

  reset() {
    this.setValue('');
    resetRowElementStyleClass(this.rowElement);
  }

  getElement() {
    if (this.customFunction.getElement) {
      return (this.customFunction.getElement as any).call(this, this.field, this.rowElement);
    }
    return null;
  }

  valid(): any {
    if (this.customFunction.valid) {
      return (this.customFunction.valid as any).call(this, this.field, this.rowElement);
    }
    return true;
  }
}
