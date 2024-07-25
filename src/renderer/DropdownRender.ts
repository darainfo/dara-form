import { FormField, ValuesInfo } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { dropdownChangeEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";
import * as utils from "src/util/utils";

export default class DropdownRender extends Render {
  private element: HTMLSelectElement;
  private defaultCheckValue;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    let initDefaultValue = "";

    if (!utils.isUndefined(field.defaultValue)) {
      initDefaultValue = field.defaultValue;
    }

    const valueKey = DropdownRender.valuesValueKey(field);
    let initDefaultValueFlag = false;
    this.field.listItem?.list?.forEach((item) => {
      let itemValue = item[valueKey];
      if (item.selected) {
        this.defaultCheckValue = itemValue;
      }
      if (itemValue == initDefaultValue) {
        initDefaultValueFlag = true;
      }
    });

    if (initDefaultValueFlag) {
      this.defaultCheckValue = initDefaultValue;
    } else if (!this.defaultCheckValue) {
      this.defaultCheckValue = this.field.listItem?.list?.length > 0 ? this.field.listItem.list[0][valueKey] || "" : "";
    }

    if (utils.isUndefined(this.defaultCheckValue)) {
      this.defaultCheckValue = "";
    }

    this.mounted();
    this.setDefaultOption();
    this.setValue(this.defaultCheckValue);
  }

  mounted() {
    dropdownChangeEvent(this.field, this.element, this);
  }

  createField() {
    const field = this.field;

    const fieldContainerElement = this.rowElement.querySelector(".df-field-container") as HTMLElement;

    let template = ` <div class="df-field"><select name="${field.$xssName}" class="form-field dropdown">
          ${this.dropdownValuesTemplate(field)}
          </select> <i class="help-icon"></i></div>
                ${Render.getDescriptionTemplate(field)}
      <div class="help-message"></div>
    `;
    fieldContainerElement.innerHTML = template;

    this.element = fieldContainerElement.querySelector(`[name="${field.$xssName}"]`) as HTMLSelectElement;
  }

  public setValueItems(items: any): void {
    if (this.field.listItem) {
      this.field.listItem.list = items;
    } else {
      this.field.listItem = {
        list: items,
      } as ValuesInfo;
    }
    this.element.innerHTML = this.dropdownValuesTemplate(this.field);
  }

  getValue() {
    return this.element.value;
  }

  setValue(value: any): void {
    this.field.$value = value;
    this.element.value = value;
  }

  reset() {
    this.setValue(this.defaultCheckValue);
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  valid(): any {
    const value = this.getValue();

    let validResult: ValidResult | boolean = true;

    if (this.field.required) {
      if (value.length < 1) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }

  public dropdownValuesTemplate(field: FormField) {
    const labelKey = Render.valuesLabelKey(field);
    const valueKey = Render.valuesValueKey(field);
    let template = "";
    field.listItem?.list?.forEach((val) => {
      const attr = `${val.selected ? "selected" : ""} ${val.disabled ? "disabled" : ""}`;
      if (utils.isUndefined(val[valueKey]) && val.label) {
        template += `<option value="${val.value || ""}" ${attr}>${val.label}</option>`;
      } else {
        template += `<option value="${val[valueKey]}" ${attr}>${Render.valuesLabelValue(labelKey, val)}</option>`;
      }
    });

    return template;
  }
}
