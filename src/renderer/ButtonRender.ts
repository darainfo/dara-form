import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";

export default class ButtonRender extends Render {

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.initEvent();
  }

  initEvent() {
    this.rowElement.querySelector(`#${this.field.$key}`)?.addEventListener("click", (evt) => {
      if (this.field.onClick) {
        this.field.onClick.call(null, this.field);
      }
    });
  }

  static template(field: FormField): string {
    const desc = field.description ? `<div>${field.description}</div>` : '';

    return `
      <button type="button" id="${field.$key}" class="df-btn">${field.label}</button> ${desc}
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
