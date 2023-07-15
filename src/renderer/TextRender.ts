import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import Lanauage from "src/util/Lanauage";

export default class TextRender implements Render {
  private element: HTMLInputElement;
  private rowElement: Element;
  private field;

  constructor(field: FormField, rowElement: HTMLElement) {
    this.field = field;
    this.rowElement = rowElement;
    this.element = rowElement.querySelector(
      `[name="${field.$xssName}"]`
    ) as HTMLInputElement;
  }

  static template(field: FormField): string {
    return `<input type="text" name="${field.name}" class="form-field text" />`;
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: any): void {
    this.element.value = value;
  }

  reset() {
    this.element.value = "";
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  valid(): any {
    const validResult = stringValidator(this.getValue(), this.field);

    if (validResult === true) {
      if (this.rowElement.classList.contains("invalid")) {
        this.rowElement.classList.remove("invalid");
      }

      if (!this.rowElement.classList.contains("valid")) {
        this.rowElement.classList.add("valid");
      }

      const helpMessageElement = this.rowElement.querySelector(".help-message");
      if (helpMessageElement) {
        helpMessageElement.innerHTML = "";
      }
    } else {
      if (!this.rowElement.classList.contains("invalid")) {
        this.rowElement.classList.add("invalid");
      }

      if (validResult !== false) {
        const message: string[] = Lanauage.validMessage(this.field, validResult);

        console.log(message);

        const helpMessageElement =
          this.rowElement.querySelector(".help-message");
        if (helpMessageElement && message.length > 0) {
          const msgHtml: string[] = [];
          message.forEach((item) => {
            msgHtml.push(`<div>${item}</div>`);
          });
          helpMessageElement.innerHTML = msgHtml.join("");
        }
      }
    }

    return validResult;
  }
}
