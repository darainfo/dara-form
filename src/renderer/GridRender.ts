import { FieldStyle, FormField } from "@t/FormField";
import Render from "./Render";
import { invalidMessage, resetRowElementStyleClass } from "src/util/validUtils";
import DaraForm from "src/DaraForm";
import utils from "src/util/utils";
import { stringValidator } from "src/rule/stringValidator";
import styleUtils from "src/util/styleUtils";
import FormTemplate from "src/FormTemplate";
import { FormOptions } from "@t/FormOptions";

let $$idx = 0;

export default class GridRender extends Render {
  private customFunction;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    if (field.renderer) {
      this.customFunction = field.renderer;
      this.mounted();
      this.setDefaultOption();
      this.setDefaultInfo();
    } else {
      this.customFunction = {} as any;
    }
  }

  mounted() {
    if (this.customFunction.mounted) {
      (this.customFunction.mounted as any).call(this, this.field, this.rowElement);
    }

    this.addRow();
  }

  static isDataRender(): boolean {
    return false;
  }

  static template(field: FormField, formTemplate: FormTemplate, options: FormOptions, olnyAddRow?: boolean): string {
    let theadTemplate = [];

    if (field.children) {
      for (const childField of field.children) {
        theadTemplate.push(`<th>${childField.label}</th>`);
      }
    }

    return `
     <div class="df-field grid-container ${field.style?.position}">
      <div class="">
        <table class="df-grid"><thead><tr>${theadTemplate.join("")}</tr></thead> <tbody></tbody></table>
      </div>
     </div>
     `;
  }

  addRow() {
    let tbodyTemplate = [];
    tbodyTemplate.push('<tr class="grid-row">');
    const options = this.daraForm.getOptions();
    const formTemplate = this.daraForm.formTemplate;
    const parentName = this.field.$xssName;

    for (const childField of this.field.children) {
      let fieldStyle: FieldStyle = styleUtils.fieldStyle(options, childField, null, true);

      childField.$xssName = parentName + "_" + childField.$xssName + "_" + ++$$idx;

      const columnElement = formTemplate.getFieldTempate(childField);
      tbodyTemplate.push(`<td class="" id="${childField.$key}"><div class="grid-column ${childField.required ? "required" : ""} " style="${fieldStyle.valueStyle}">${columnElement}</div></td>`);
    }
    tbodyTemplate.push("</tr>");

    const gridBodyEle = this.rowElement.querySelector("tbody");

    console.log(gridBodyEle, tbodyTemplate);
    /**
     *
     *
     * 처리 할것.
     */

    if (gridBodyEle) {
      gridBodyEle.innerHTML = tbodyTemplate.join("");
    }
  }

  getValue() {
    const allGridRows = this.rowElement.querySelector(".df-grid .grid-row");

    console.log(allGridRows);

    if (this.customFunction.getValue) {
      return (this.customFunction.getValue as any).call(this, this.field, this.rowElement);
    }
    return "";
  }

  setValue(value: any): void {
    this.field.$value = value;
    if (this.customFunction.setValue) {
      (this.customFunction.setValue as any).call(this, value, this.field, this.rowElement);
    }
  }

  reset() {
    this.setDefaultInfo();
    resetRowElementStyleClass(this.rowElement);
  }

  getElement() {
    if (this.customFunction.getElement) {
      return (this.customFunction.getElement as any).call(this, this.field, this.rowElement);
    }
    return null;
  }

  valid(): any {
    if (this.customFunction.valid) {
      const validResult = (this.customFunction.valid as any).call(this, this.field, this.rowElement);

      invalidMessage(this.field, this.rowElement, validResult);

      return;
    }
    const validResult = stringValidator(this.getValue(), this.field);

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
