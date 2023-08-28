import { FormField } from "@t/FormField";
import Render from "./Render";
import { numberValidator } from "src/rule/numberValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { customChangeEventCall, numberInputEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class RangeRender extends Render {
  private element: HTMLInputElement;
  private rangeNumElement: Element;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.rangeNumElement = rowElement.querySelector(".range-num") as Element;

    this.initEvent();
    this.setDefaultInfo();
  }

  initEvent() {
    this.element.addEventListener("input", (e: any) => {
      this.rangeNumElement.innerHTML = e.target.value;

      this.element.setAttribute("title", e.target.value);
      customChangeEventCall(this.field, e, this);
      this.valid();
    });
  }

  static template(field: FormField): string {
    const desc = field.description ? `<div>${field.description}</div>` : "";

    return `
        <div class="df-field">
            <span class="range-num">${field.defaultValue ? field.defaultValue : 0}</span>
            <input type="range" name="${field.name}" class="form-field range help-icon" min="${field.rule.minimum}" max="${field.rule.maximum}"/>
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
