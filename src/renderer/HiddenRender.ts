import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";

export default class HiddenRender extends Render {
  private field;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, rowElement);
    this.field = field;
    this.rowElement = rowElement;
    this.field.$value = field.defaultValue;
  }

  initEvent() {

  }

  static template(field: FormField): string {
    return ``;
  }

  getValue() {
    return this.field.$value;
  }

  setValue(value: any): void {
    this.field.$value = value;
  }

  reset() {
    this.setValue(this.field.defaultValue);
  }

  getElement() {
    return;
  }

  valid(): any {
    return true;
  }
}
