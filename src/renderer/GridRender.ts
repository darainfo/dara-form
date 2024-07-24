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
    let colgroupTemplate = [];
    let addBtnTemplate = [];

    if (field.children) {
      if (field.gridOptions?.disableAddButton !== true) {
        addBtnTemplate.push(`<div class="df-grid-btn-area txt-${field.gridOptions?.align ?? "center"}"><button type="button" class="df-btn df-grid-add-row-btn"><i class="df-icon df-add-icon"></i> Add</button></div>`);
      }
      colgroupTemplate.push("<colgroup>");

      theadTemplate.push("<tr>");
      if (field.gridOptions?.disableRemoveButton !== true) {
        colgroupTemplate.push(`<col style="width:38px">`);
        theadTemplate.push("<th></th>");
      }

      for (const childField of field.children) {
        colgroupTemplate.push(`<col style="width:${childField.style?.width ?? "*"}">`);
        theadTemplate.push(`<th class="df-grid-header">${childField.label}</th>`);
      }
      colgroupTemplate.push("</colgroup>");
      theadTemplate.push("</tr>");
    }

    return `
    <div class="df-grid-field">
      ${addBtnTemplate.join("")}
     <div class="df-grid-container ${field.style?.position ?? ""}" style="height:${field.gridOptions?.height ?? "auto"};">
        <table class="df-grid">${colgroupTemplate.join("")}<thead>${theadTemplate.join("")}</thead><tbody></tbody></table>
     </div>
     </div>
     `;
  }

  /**
   * add row
   */
  addRow(valueItem?: any): void {
    let rowTemplate = [];

    const options = this.daraForm.getOptions();
    const formTemplate = this.gridForm.formTemplate;
    const parentName = this.field.$xssName;

    ++$$idx;
    let addColumns = [];
    rowTemplate.push(`<tr class="grid-row">`);

    if (this.field.gridOptions?.disableRemoveButton !== true) {
      rowTemplate.push(`<td><button type="button" data-row-idx="${$$idx}" class="df-btn df-grid-row-remove"><i class="df-icon df-remove-icon"></i></button></td>`);
    }

    for (const childField of this.field.children) {
      let fieldStyle: FieldStyle = styleUtils.fieldStyle(options, childField, null, true);

      let columnField = utils.merge({}, childField) as FormField;

      addColumns.push(columnField);
      columnField.$orgin = childField;
      columnField.name = columnField.name + "_" + $$idx;
      columnField.$xssName = parentName + "_" + utils.getXssFieldName(columnField);

      const columnElement = formTemplate.getFieldTemplate(columnField);

      // static 로 사용할지 객체 자체에서 추가 할지 여부 확인할것.

      rowTemplate.push(`<td id="${columnField.$xssName}"><div class="df-field-container ${columnField.required ? "required" : ""} " style="${fieldStyle.valueStyle}">${columnElement}</div></td>`);
    }
    rowTemplate.push("</tr>");

    this.allAddRowInfo[$$idx] = addColumns;

    const addRowElement = this.createTrRow(rowTemplate.join(""));

    if (addRowElement) {
      this.rowElement.querySelector("tbody")?.append(addRowElement);

      addRowElement.querySelector(".df-grid-row-remove")?.addEventListener("click", (evt) => {
        this.removeRow(evt);
      });
    }

    valueItem = valueItem ?? {};
    for (let columnField of this.allAddRowInfo[$$idx]) {
      columnField.$renderer = new (columnField.$renderer as any)(columnField, addRowElement?.querySelector(`#${columnField.$xssName}`), this.gridForm);

      if (valueItem[columnField.$orgin.name]) {
        columnField.$renderer.setValue(valueItem[columnField.$orgin.name]);
      }
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
      if (rowElement.parentElement?.childElementCount == 1) return;

      let rowIdx = (evt.currentTarget as Element)?.getAttribute("data-row-idx") || "-1";

      delete this.allAddRowInfo[parseInt(rowIdx, 10)];
      rowElement.remove();
    }
  }

  allRemoveRow(): void {
    this.rowElement.querySelector("tbody")?.replaceChildren();
    this.allAddRowInfo = {} as NumberKeyMap;
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

      let rowInfo = {} as any;
      for (let childIdx = 0; childIdx < childrenLength; childIdx++) {
        let childField = children[childIdx];
        rowInfo[childField.name] = this.gridForm.getFieldValue(rowColumns[childIdx].name); // rowColumns[childIdx].$renderer.getValue();
      }

      result.push(rowInfo);
    }
    return result;
  }

  setValue(value: any): void {
    this.field.$value = value;

    let valueArr: any[] = [];
    if (Array.isArray(value)) {
      valueArr = value;
    } else {
      if (utils.isPlainObject(value)) {
        valueArr.push(value);
      }
    }

    if (valueArr.length > 0) {
      this.allRemoveRow();

      for (let valueItem of valueArr) {
        this.addRow(valueItem);
      }
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
