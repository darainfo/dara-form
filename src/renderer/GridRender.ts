import { FieldStyle, FormField } from "@t/FormField";
import Render from "./Render";
import { invalidMessage, resetRowElementStyleClass } from "src/util/validUtils";
import DaraForm from "src/DaraForm";
import * as utils from "src/util/utils";
import { stringValidator } from "src/rule/stringValidator";
import styleUtils from "src/util/styleUtils";
import FormTemplate from "src/FormTemplate";
import { FormOptions } from "@t/FormOptions";
import { NumberKeyMap } from "@t/DataMap";
import { util } from "prettier";

let $$idx = 0;

export default class GridRender extends Render {
  private customFunction;
  private gridForm;
  private allAddRowInfo = {} as NumberKeyMap;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    if (field.renderer) {
      this.customFunction = field.renderer;
    } else {
      this.customFunction = {} as any;
    }

    const gridFromOpt = {
      style: {
        width: "100%",
        labelWidth: 3,
        valueWidth: 9,
        position: "left-right",
      },
      autoCreate: false,
      notValidMessage: "This form is not valid.",
      fields: [],
    } as FormOptions;

    this.gridForm = new DaraForm(field.$xssName, gridFromOpt);

    this.mounted();
    this.setDefaultOption();
    this.setDefaultInfo();
  }

  mounted() {
    this.addRow();

    if (this.customFunction.mounted) {
      (this.customFunction.mounted as any).call(this, this.field, this.rowElement);
    }

    this.rowElement.querySelector(".df-grid-add-row-btn")?.addEventListener("click", (evt) => {
      this.addRow();
    });
  }

  static isDataRender(): boolean {
    return false;
  }

  static template(field: FormField, formTemplate: FormTemplate, options: FormOptions, olnyAddRow?: boolean): string {
    let theadTemplate = [];

    if (field.children) {
      if (field.enableGridAddButton !== false) {
        theadTemplate.push(`<tr><td class="df-grid-btn-area" colspan="${field.children.length + 1}"><button type="button" class="df-grid-add-row-btn">+ Add</button></td></tr>`);
      }
      theadTemplate.push("<tr><th></th>");
      for (const childField of field.children) {
        theadTemplate.push(`<th class="df-grid-header">${childField.label}</th>`);
      }
      theadTemplate.push("</tr>");
    }

    return `
     <div class="df-field grid-container ${field.style?.position}">
      <div class="">
        <table class="df-grid"><thead>${theadTemplate.join("")}</thead><tbody></tbody></table>
      </div>
     </div>
     `;
  }

  /**
   * add row
   */
  addRow() {
    let tbodyTemplate = [];

    const options = this.daraForm.getOptions();
    const formTemplate = this.gridForm.formTemplate;
    const parentName = this.field.$xssName;

    ++$$idx;
    let addColumns = [];
    tbodyTemplate.push(`<tr class="grid-row"><td><button type="button" data-row-idx="${$$idx}" class="df-grid-row-remove">X</button></td>`);
    for (const childField of this.field.children) {
      let fieldStyle: FieldStyle = styleUtils.fieldStyle(options, childField, null, true);

      let columnField = utils.merge({}, childField) as FormField;

      addColumns.push(columnField);

      columnField.name = columnField.name + "_" + $$idx;

      const columnElement = formTemplate.getFieldTemplate(columnField);
      columnField.$xssName = parentName + "_" + columnField.$xssName;

      tbodyTemplate.push(`<td class=""><div class="grid-column ${columnField.required ? "required" : ""} " style="${fieldStyle.valueStyle}">${columnElement}</div></td>`);
    }
    tbodyTemplate.push("</tr>");

    this.allAddRowInfo[$$idx] = addColumns;

    const addRowElement = this.createTrRow(tbodyTemplate.join(""));

    console.log("addRowElement : ", addRowElement);

    if (addRowElement) {
      this.rowElement.querySelector("tbody")?.append(addRowElement);

      addRowElement.querySelector(".df-grid-row-remove")?.addEventListener("click", (evt) => {
        this.removeRow(evt);
      });
    }

    for (let columnField of this.allAddRowInfo[$$idx]) {
      columnField.$renderer = new (columnField.$renderer as any)(columnField, this.rowElement, this.gridForm);
    }
  }

  /**
   * remove row
   *
   * @param evt event
   */
  removeRow(evt: Event): void {
    const target = evt.target as Element;

    const rowElement = target.closest("tr");

    if (rowElement) {
      let rowIdx = rowElement.getAttribute("data-row-idx") || "-1";

      delete this.allAddRowInfo[parseInt(rowIdx, 10)];
      rowElement.remove();
    }
  }

  createTrRow(trTemplate: string): Element | null {
    const template = document.createElement("template");
    template.innerHTML = trTemplate;
    return template.content.firstElementChild;
  }

  getValue() {
    if (this.customFunction.getValue) {
      return (this.customFunction.getValue as any).call(this, this.field, this.rowElement);
    }

    let result = [];
    const children = this.field.children;
    const childrenLength = children.length;
    for (let idx in this.allAddRowInfo) {
      const rowColumns = this.allAddRowInfo[idx];

      console.log(rowColumns);

      let rowInfo = {} as any;
      for (let childIdx = 0; childIdx < childrenLength; childIdx++) {
        let childField = children[childIdx];
        console.log(rowColumns[childIdx].$renderer);
        rowInfo[childField.name] = this.gridForm.getFieldValue(rowColumns[childIdx].name); // rowColumns[childIdx].$renderer.getValue();
      }

      result.push(rowInfo);
    }
    return result;
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
