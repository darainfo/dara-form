import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import DaraForm from "src/DaraForm";
import { DateTimePicker } from "dara-datetimepicker";

import "dara-datetimepicker/dist/dara.datetimepicker.min.css";
import utils from "src/util/utils";

export default class DateRender extends Render {
  private element: HTMLInputElement;
  private dateObj: any;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.initEvent();
    this.setDefaultOption();
    this.setDefaultInfo();
  }

  initEvent() {
    let dateOnChangeEvent: any;
    this.field.customOptions = Object.assign({}, this.field.customOptions);
    if (typeof this.field.customOptions.onChange !== "undefined") {
      dateOnChangeEvent = typeof this.field.customOptions.onChange;
    }

    if (utils.isUndefined(this.field.customOptions.mode)) {
      if (this.field.renderType == "datemonth" || this.field.renderType == "datehour") {
        this.field.customOptions.mode = this.field.renderType.replace("date", "");
      } else {
        this.field.customOptions.mode = this.field.renderType;
      }
    }

    this.field.customOptions.onChange = (dt: any, e: Event) => {
      if (dateOnChangeEvent) {
        dateOnChangeEvent.call(null, dt, e);
      }

      this.setValue(dt);

      this.changeEventCall(this.field, e, this);
    };

    this.dateObj = new DateTimePicker(this.element, this.field.customOptions, {} as any);
  }

  static template(field: FormField): string {
    return `
    <div class="df-field">
      <input type="text" name="${field.name}" class="form-field text help-icon" autocomplete="off"/>
     </div>
     ${Render.getDescriptionTemplate(field)}
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
    this.setDefaultInfo();
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  valid(): any {
    const validResult = stringValidator(this.getValue(), this.field);

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
