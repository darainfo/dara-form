import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";

export default class ButtonRender extends Render {
  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.mounted();
    this.setDefaultOption();
  }

  mounted() {
    this.rowElement.querySelector(`#${this.field.$key}`)?.addEventListener("click", (evt) => {
      if (this.field.onClick) {
        this.field.onClick.call(null, this.field);
      }
    });
  }

  static isDataRender(): boolean {
    return false;
  }

  static template(field: FormField): string {
    return `
      <button type="button" id="${field.$key}" class="df-btn">${field.label}</button> ${Render.getDescriptionTemplate(field)}
     `;
  }

  getValue() {
    return "";
  }

  setValue(value: any): void {}

  reset() {
    this.setDisabled(false);
  }

  getElement() {
    return null;
  }

  valid(): any {
    return true;
  }
}
