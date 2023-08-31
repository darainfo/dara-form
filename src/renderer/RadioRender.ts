import { FormField, ValuesInfo } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import util from "src/util/utils";
import { customChangeEventCall } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";
import utils from "src/util/utils";

export default class RadioRender extends Render {
  private defaultCheckValue;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    this.defaultCheckValue = [];
    if (!utils.isUndefined(field.defaultValue)) {
      this.defaultCheckValue = field.defaultValue;
    } else {
      const valueKey = RadioRender.valuesValueKey(field);
      this.field.listItem?.list?.forEach((val) => {
        if (val.selected) {
          this.defaultCheckValue.push(val[valueKey]);
        }
      });

      if (!this.defaultCheckValue) {
        this.defaultCheckValue = this.field.listItem?.list?.length > 0 ? this.field.listItem?.list[0][valueKey] : "";
      }
    }

    this.initEvent();

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
    return `input[type="radio"][name="${this.field.$xssName}"]`;
  }

  static template(field: FormField): string {
    const templates: string[] = [];
    const fieldName = field.name;

    const desc = field.description ? `<div>${field.description}</div>` : "";

    const labelKey = this.valuesLabelKey(field);
    const valueKey = this.valuesValueKey(field);

    templates.push(`<div class="df-field"><div class="field-group">`);

    field.listItem?.list?.forEach((val) => {
      const radioVal = val[valueKey];

      templates.push(
        `<span class="field ${field.viewMode == "vertical" ? "vertical" : "horizontal"}">
                <label>
                    <input type="radio" name="${fieldName}" value="${radioVal}" class="form-field radio" ${val.selected ? "checked" : ""} />
                    ${this.valuesLabelValue(labelKey, val)}
                </label>
                </span>
                `
      );
    });
    templates.push(`<i class="dara-icon help-icon"></i></div></div>
        ${desc}
        <div class="help-message"></div>
         `);

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

      containerEle.innerHTML = RadioRender.template(this.field);

      this.initEvent();
    }
  }

  getValue() {
    return (this.rowElement.querySelector(`[name="${this.field.$xssName}"]:checked`) as HTMLInputElement)?.value;
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

    const elements = this.rowElement.querySelectorAll(this.getSelector());

    elements.forEach((ele) => {
      let radioEle = ele as HTMLInputElement;
      if (radioEle.value == value) {
        radioEle.checked = true;
      } else {
        radioEle.checked = false;
      }
    });
  }

  reset() {
    this.setValue(this.defaultCheckValue);
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }

  getElement(): any {
    return this.rowElement.querySelectorAll(this.getSelector());
  }

  valid(): any {
    const value = this.getValue();

    let validResult: ValidResult | boolean = true;

    if (this.field.required) {
      if (util.isBlank(value)) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
