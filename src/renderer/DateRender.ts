import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { stringValidator } from "@/rule/stringValidator";
import { resetRowElementStyleClass, invalidMessage } from "@/util/validUtils";
import { DaraForm } from "@/DaraForm";
import DateTimePicker from "@daracl/datetimepicker";

import * as utils from "@/util/utils";

export default class DateRender extends Render {
  private element: HTMLInputElement;
  private dateObj: any;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    this.mounted();
    this.setDefaultOption();
    this.setDefaultInfo();
  }

  mounted() {
    let dateOnSelectEvent: any;
    this.field.customOptions = Object.assign({}, this.field.customOptions);
    if (typeof this.field.customOptions.onSelect !== "undefined") {
      dateOnSelectEvent = typeof this.field.customOptions.onSelect;
    }

    if (utils.isUndefined(this.field.customOptions.mode)) {
      if (this.field.renderType == "datemonth" || this.field.renderType == "datehour") {
        this.field.customOptions.mode = this.field.renderType.replace("date", "");
      } else {
        this.field.customOptions.mode = this.field.renderType;
      }
    }

    this.field.customOptions.onSelect = (dt: any, e: Event) => {
      if (dateOnSelectEvent) {
        dateOnSelectEvent(dt, e);
      }

      this.setValue(dt);

      this.valid();
    };

    this.dateObj = new DateTimePicker(this.element, this.field.customOptions, {} as any);
  }

  createField() {
    const field = this.field;

    const fieldContainerElement = this.rowElement.querySelector(".df-field-container") as HTMLElement;

    fieldContainerElement.innerHTML = `
    <div class="df-field">
      <input type="text" name="${field.$xssName}" class="form-field text help-icon" autocomplete="off" readonly/>
     </div>
     ${Render.getDescriptionTemplate(field)}
     <div class="help-message"></div>
     `;

    this.element = fieldContainerElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: any, changeCheckFlag?: boolean): void {
    if (changeCheckFlag !== false && this.changeEventCall(this.field, null, this, value) === false) {
      this.element.value = this.field.$value;
      return;
    }

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
