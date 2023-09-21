import { FormField } from "@t/FormField";
import Render from "./Render";
import { resetRowElementStyleClass } from "src/util/validUtils";
import DaraForm from "src/DaraForm";

export default class CustomRender extends Render {
  private customFunction;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.customFunction = field.renderer;
    this.initEvent();
    this.setDefaultInfo();
  }

  initEvent() {
    if (this.customFunction.initEvent) {
      (this.customFunction.initEvent as any).call(this, this.field, this.rowElement);
    }
  }

  static isDataRender(): boolean {
    return false;
  }

  static template(field: FormField): string {
    if ((field.renderer as any).template) {
      return ` <div class="df-field">${(field.renderer as any).template()}</div>
          ${Render.getDescriptionTemplate(field)}
      <div class="help-message"></div>`;
    }
    return "";
  }

  getValue() {
    if (this.customFunction.getValue) {
      return (this.customFunction.getValue as any).call(this, this.field, this.rowElement);
    }
    return "";
  }

  setValue(value: any): void {
    this.field.$value = value;
    if (this.customFunction.setValue) {
      (this.customFunction.setValue as any).call(this, value, this.field, this.rowElement);
    }
  }

  reset() {
    this.setDefaultInfo();
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
