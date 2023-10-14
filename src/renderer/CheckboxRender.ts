import { FormField, ValuesInfo } from "@t/FormField";
import Render from "./Render";
import utils from "src/util/utils";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { customChangeEventCall } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class CheckboxRender extends Render {
  private defaultCheckValue: any[] = [];

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    this.defaultCheckValue = [];
    let initDefaultValue = [] as any;
    if (!utils.isUndefined(field.defaultValue)) {
      if (utils.isArray(field.defaultValue)) {
        initDefaultValue = field.defaultValue;
      } else {
        initDefaultValue = [field.defaultValue];
      }
    }

    const valueKey = CheckboxRender.valuesValueKey(field);

    let initDefaultValueFlag = false;
    this.field.listItem?.list?.forEach((item) => {
      let itemValue = item[valueKey];
      if (item.selected) {
        this.defaultCheckValue.push(itemValue ? itemValue : true);
      }
      if (initDefaultValue.includes(itemValue)) {
        initDefaultValueFlag = true;
      }
    });

    this.defaultCheckValue = initDefaultValueFlag ? initDefaultValue : this.defaultCheckValue;

    this.initEvent();
    this.setDefaultOption();
    this.setValue(this.defaultCheckValue);
  }

  public initEvent() {
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

    checkboxes.forEach((ele) => {
      ele.addEventListener("change", (e: Event) => {
        customChangeEventCall(this.field, e, this);
        this.valid();
      });
    });
  }

  public getSelector() {
    return `input[type="checkbox"][name="${this.field.$xssName}"]`;
  }

  static template(field: FormField): string {
    const templates: string[] = [];
    const fieldName = field.name;

    const labelKey = this.valuesLabelKey(field);
    const valueKey = this.valuesValueKey(field);

    templates.push(` <div class="df-field"><div class="field-group">`);
    field.listItem?.list?.forEach((val) => {
      const checkVal = val[valueKey];
      templates.push(`
          <span class="field ${field.listItem.orientation == "vertical" ? "vertical" : "horizontal"}">
              <label>
                  <input type="checkbox" name="${fieldName}" value="${checkVal ? utils.replace(checkVal) : ""}" class="form-field checkbox" ${val.selected ? "checked" : ""} ${val.disabled ? "disabled" : ""}  />
                  ${this.valuesLabelValue(labelKey, val)}
              </label>
          </span>
      `);
    });
    templates.push(`<i class="dara-icon help-icon"></i></div></div> ${Render.getDescriptionTemplate(field)}<div class="help-message"></div>`);

    return templates.join("");
  }

  public setValueItems(items: any): void {
    const containerEle = this.rowElement.querySelector(".df-field-container");
    if (containerEle) {
      if (this.field.listItem) {
        this.field.listItem.list = items;
      } else {
        this.field.listItem = {
          list: items,
        } as ValuesInfo;
      }
      containerEle.innerHTML = CheckboxRender.template(this.field);

      this.initEvent();
    }
  }

  getValue() {
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

    if (checkboxes.length > 1) {
      const checkValue: any[] = [];
      checkboxes.forEach((ele) => {
        const checkEle = ele as HTMLInputElement;
        if (checkEle.checked) {
          checkValue.push(checkEle.value);
        }
      });
      return checkValue;
    } else {
      const checkElement = this.rowElement.querySelector(`[name="${this.field.$xssName}"]`) as HTMLInputElement;

      if (checkElement?.checked) {
        return checkElement.value ? checkElement.value : true;
      }

      return checkElement.value ? "" : false;
    }
  }

  setValue(value: any): void {
    this.field.$value = value;
    if (value === true) {
      (this.rowElement.querySelector(`[name="${this.field.$xssName}"]`) as HTMLInputElement).checked = true;
      return;
    }

    if (value === false) {
      (this.rowElement.querySelector(`[name="${this.field.$xssName}"]`) as HTMLInputElement).checked = false;
      return;
    }

    let valueArr: any[] = [];
    if (Array.isArray(value)) {
      valueArr = value;
    } else {
      valueArr.push(value);
    }

    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

    checkboxes.forEach((ele) => {
      (ele as HTMLInputElement).checked = false;
    });

    valueArr.forEach((val) => {
      const ele = this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${val}"]`) as HTMLInputElement;
      if (ele) ele.checked = true;
    });
  }

  reset() {
    if (this.field.listItem?.list?.length == 1 && this.defaultCheckValue.length == 1) {
      this.setValue(true);
    } else {
      this.setValue(this.defaultCheckValue);
    }
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }

  getElement(): any {
    return this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`);
  }

  valid(): any {
    const value = this.getValue();

    let validResult: ValidResult | boolean = true;

    if (this.field.required && utils.isArray(value)) {
      if ((value as any[]).length < 1) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
