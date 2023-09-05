import { FormOptions } from "@t/FormOptions";
import { FieldStyle, FormField } from "@t/FormField";
import utils from "./util/utils";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { stringValidator } from "./rule/stringValidator";
import { numberValidator } from "./rule/numberValidator";
import { regexpValidator } from "./rule/regexpValidator";
import FieldInfoMap from "src/FieldInfoMap";
import { TEXT_ALIGN } from "./constants";
import styleUtils from "./util/styleUtils";

const defaultOptions = {
  mode: "horizontal", // horizontal , vertical // 가로 세로 모드
  width: "100%",
  labelStyle: {
    width: "20%",
    align: TEXT_ALIGN.left,
  },
  notValidMessage: "This form is not valid.",
  fields: [],
} as FormOptions;

let daraFormIdx = 0;

interface FieldMap {
  [key: string]: FormField;
}

/**
 * DaraForm class
 *
 * @class DaraForm
 * @typedef {DaraForm}
 */
export default class DaraForm {
  private readonly options;

  private isHorizontal;

  private formElement;

  private fieldInfoMap;

  private formValue: any = {};

  private addRowFields: string[] = [];

  constructor(selector: string, options: FormOptions, message: Message) {
    this.options = Object.assign({}, defaultOptions, options);

    daraFormIdx += 1;

    Lanauage.set(message);

    this.fieldInfoMap = new FieldInfoMap(selector);

    this.isHorizontal = this.options.mode === "horizontal";

    const formElement = document.querySelector(selector);
    if (formElement) {
      formElement.className = `dara-form df-${daraFormIdx}`;
      formElement.setAttribute("style", `width:${this.options.width};`);

      this.formElement = formElement;
      this.createForm(this.options.fields);
    } else {
      throw new Error(`${selector} form selector not found`);
    }
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  public createForm(fields: FormField[]) {
    fields.forEach((field) => {
      this.addRow(field);
    });
    this.conditionCheck();
  }

  /**
   * field row 추가.
   *
   * @param field
   */
  public addRow(field: FormField) {
    if (this.checkHiddenField(field)) {
      return;
    }

    this.addRowFields = [];

    let rednerTemplate = this.rowTemplate(field);

    this.formElement.insertAdjacentHTML("beforeend", rednerTemplate); // Append the element

    this.addRowFields.forEach((fieldSeq) => {
      const fileldInfo = this.fieldInfoMap.get(fieldSeq);
      fileldInfo.$xssName = utils.unFieldName(fileldInfo.name);

      const fieldRowElement = this.formElement.querySelector(`#${fileldInfo.$key}`);
      fileldInfo.$renderer = new (fileldInfo.$renderer as any)(fileldInfo, fieldRowElement, this);
      fieldRowElement?.removeAttribute("id");
    });
  }

  public getLabelTemplate(field: FormField) {
    const requiredTemplate = field.required ? `<span class="required"></span>` : "";
    const tooltipTemplate = utils.isBlank(field.tooltip) ? "" : `<span class="df-tooltip">?<span class="tooltip">${field.tooltip}</span></span>`;

    return `${field.label || ""} ${tooltipTemplate} ${requiredTemplate}`;
  }

  /**
   * 그룹 템플릿
   *
   * @param {FormField} field
   * @returns {*}
   */
  public rowTemplate(field: FormField) {
    let viewStyleClass = "";
    let childLabelWidth = "3";
    let isHorizontal = false;
    if (field.viewMode === "horizontal") {
      childLabelWidth = field.childLabelWidth ? field.childLabelWidth : "";
      isHorizontal = true;
    } else {
      viewStyleClass = "vertical";
    }

    const template = [];

    let fieldTemplate = "";
    let labelAlignStyleClass = this.getTextAlignStyle(field, null);

    if (field.children) {
      if (!utils.isUndefined(field.name)) {
        fieldTemplate = this.getFieldTempate(field);
      }
      fieldTemplate += this.childTemplate(field, childLabelWidth, isHorizontal, viewStyleClass);
    } else {
      fieldTemplate = this.getFieldTempate(field);
    }

    template.push(`
        <div class="df-row field-group" id="${field.$key}">
          <div class="df-label ${labelAlignStyleClass}" style="${childLabelWidth}">
              ${field.style?.labelHide ? "" : `<span>${this.getLabelTemplate(field)}</span>`}
          </div>
          <div class="df-field-container ${field.required ? "required" : ""}">
              ${fieldTemplate}
          </div>
        </div>
    `);

    return template.join("");
  }
  public childTemplate(field: FormField, childLabelWidth: string, isHorizontal: boolean, viewStyleClass: string) {
    const template = [];

    let beforeLabelAlignStyleClass = "";
    let firstFlag = true;
    let isEmptyLabel = false;
    template.push(`<div class="df-row" id="${field.$key}">`);
    for (const childField of field.children) {
      childField.$parent = field;

      if (this.checkHiddenField(childField)) {
        continue;
      }

      let childTempate = "";

      if (childField.children) {
        childTempate = this.rowTemplate(childField);
      } else {
        childTempate = this.getFieldTempate(childField);
      }
      let addStyleClass = "";
      let addStyle = "";

      let labelStyle: FieldStyle = { clazz: "", style: "" };
      let valueStyle: FieldStyle = { clazz: "", style: "" };

      if (isHorizontal) {
        labelStyle = styleUtils.labelWidthStyle(field, childLabelWidth);
        valueStyle = styleUtils.valueWidthStyle(field, childLabelWidth);
      }

      let labelAlignStyleClass = this.getTextAlignStyle(childField, field, true);

      if (utils.isBlank(labelAlignStyleClass)) {
        labelAlignStyleClass = beforeLabelAlignStyleClass;
      } else if (firstFlag) {
        beforeLabelAlignStyleClass = labelAlignStyleClass + "";
      }

      let labelHideFlag = childField.style?.labelHide || (utils.isUndefined(childField.label) ? true : false);

      template.push(`<div class="field-group col-xs">
        ${labelHideFlag ? (isEmptyLabel ? `<span class="df-label ${labelStyle.clazz}"></span>` : "") : `<span class="df-label ${labelAlignStyleClass}" style="${labelStyle.style}">${this.getLabelTemplate(childField)}</span>`}
        <span class="df-field-container ${valueStyle.clazz}" ${childField.required ? "required" : ""}">${childTempate}</span>
      </div>`);

      if (!labelHideFlag) {
        isEmptyLabel = true;
      }

      firstFlag = false;
    }

    template.push("</div>");

    return template.join("");
  }

  /**
   * text aling style
   *
   * @param {FormField} filed
   * @param {(FormField | null)} parentField
   * @returns {string} style class
   */
  private getTextAlignStyle(filed: FormField, parentField: FormField | null, isGroupChild?: boolean) {
    let labelAlign;
    if (isGroupChild) {
      labelAlign = filed.style?.labelAlign;
      if (utils.isUndefined(labelAlign)) {
        return null;
      }
    } else {
      labelAlign = filed.style?.labelAlign ? filed.style.labelAlign : parentField?.style?.labelAlign || this.options.labelStyle.align;
    }

    let labelAlignStyleClass;
    if (Object.keys(TEXT_ALIGN).includes(labelAlign)) {
      labelAlignStyleClass = TEXT_ALIGN[labelAlign];
    } else {
      labelAlignStyleClass = TEXT_ALIGN.left;
    }

    return `txt-${labelAlignStyleClass}`;
  }

  /**
   * field tempalte 구하기
   *
   * @param {FormField} field
   * @returns {string}
   */
  public getFieldTempate(field: FormField): string {
    if (!utils.isBlank(field.name) && this.fieldInfoMap.hasFieldName(field.name)) {
      throw new Error(`Duplicate field name "${field.name}"`);
    }

    this.addRowFieldInfo(field);

    return (field.$renderer as any).template(field);
  }

  public checkHiddenField(field: FormField) {
    const isHidden = utils.isHiddenField(field);

    if (isHidden) {
      this.fieldInfoMap.addField(field);
      field.$renderer = new (field.$renderer as any)(field, null, this);

      return true;
    }

    return false;
  }

  /**
   * add row file map
   *
   * @param {FormField} field
   */
  public addRowFieldInfo(field: FormField) {
    utils.replaceXssField(field);
    this.fieldInfoMap.addField(field);
    this.addRowFields.push(field.$key);
  }

  /**
   * 폼 데이터 reset
   */
  public resetForm = () => {
    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const seq in fieldMap) {
      const filedInfo = fieldMap[seq];
      const renderInfo = filedInfo.$renderer;

      if (renderInfo && typeof renderInfo.reset === "function") {
        renderInfo.reset();
      }
    }
    this.formValue = {};
    this.conditionCheck();
  };

  /**
   * field 값 reset
   * @param fieldName 필드명
   */
  public resetField = (fieldName: string) => {
    this.fieldInfoMap.getFieldName(fieldName).$renderer.reset();
    this.formValue[fieldName] = "";
    this.conditionCheck();
  };

  /**
   * 필드 element 얻기
   *
   * @param {string} fieldName
   * @returns {*}
   */
  public getFieldElement(fieldName: string) {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field?.$renderer) {
      return field.$renderer.getElement();
    }

    return null;
  }

  public getField(fieldName: string): FormField {
    return this.fieldInfoMap.getFieldName(fieldName);
  }

  /**
   * field 값 얻기
   *
   * @param fieldName  필드명
   * @returns
   */
  public getFieldValue = (fieldName: string) => {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field) {
      return field.$renderer.getValue();
    }
    return null;
  };

  /**
   * 폼 필드 값 얻기
   * @param isValid 폼 유효성 검사 여부 default:false|undefined true일경우 검사.
   * @returns
   */
  public getValue = (isValid: boolean): any => {
    return this.fieldInfoMap.getAllFieldValue(this.formValue, isValid);
  };

  public getFormDataValue = (isValid: boolean): any => {
    return this.fieldInfoMap.getFormDataValue(this.formValue, isValid);
  };

  /**
   * 폼 필드 value 셋팅
   * @param values
   */
  public setValue = (values: any) => {
    Object.keys(values).forEach((fieldName) => {
      this._setFieldValue(fieldName, values[fieldName]);
    });
    this.conditionCheck();
  };

  public setFieldValue = (fieldName: string, value: any) => {
    this._setFieldValue(fieldName, value);
    this.conditionCheck();
  };

  private _setFieldValue(fieldName: string, value: any) {
    this.formValue[fieldName] = value;
    const filedInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (filedInfo) {
      filedInfo.$renderer.setValue(value);
    }
  }

  public setFieldItems = (fieldName: string, values: any) => {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field) {
      return field.$renderer.setValueItems(values);
    }
  };

  /**
   * field 추가
   *
   * @param {FormField} field
   */
  public addField = (field: FormField) => {
    this.options.fields.push(field);
    this.addRow(field);
    this.conditionCheck();
  };

  /**
   * field 제거
   *
   * @param {string} fieldName
   */
  public removeField = (fieldName: string) => {
    const element = this.getFieldElement(fieldName);

    if (element != null) {
      element.closest(".df-row")?.remove();

      this.fieldInfoMap.removeFieldInfo(fieldName);
    }
  };

  /**
   * 폼 유효성 검증 여부
   *
   * @returns {boolean}
   */
  public isValidForm = (): boolean => {
    const result = this.validForm();
    return result.length > 0;
  };

  /**
   * 유효성 검증 폼 검증여부 리턴
   *
   * @returns {any[]}
   */
  public validForm = (): any[] => {
    let validResult = [] as any;
    let firstFlag = this.options.autoFocus !== false;

    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const fieldKey in fieldMap) {
      const filedInfo = fieldMap[fieldKey];
      const renderInfo = filedInfo.$renderer;

      let fieldValid = renderInfo.valid();

      if (fieldValid !== true) {
        if (firstFlag) {
          renderInfo.focus();
          firstFlag = false;
        }
        validResult.push(fieldValid);
      }
    }

    return validResult;
  };

  public isValidField = (fieldName: string): boolean => {
    const filedInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (utils.isUndefined(filedInfo)) {
      throw new Error(`Field name [${fieldName}] not found`);
    }

    const renderInfo = filedInfo.$renderer;
    if (renderInfo) {
      return renderInfo.valid() === true;
    }

    return true;
  };

  public getOptions = () => {
    return this.options;
  };

  public conditionCheck() {
    this.fieldInfoMap.conditionCheck();
  }

  public setFieldDisabled(fieldName: string, flag: boolean) {
    const filedInfo = this.fieldInfoMap.getFieldName(fieldName);
    filedInfo.$renderer.setDisabled(flag);
  }

  /*
    destroy = () => {
        return this.options;
    }
    */

  public static validator = {
    string: (value: string, field: FormField) => {
      return stringValidator(value, field);
    },
    number: (value: string, field: FormField) => {
      return numberValidator(value, field);
    },
    regexp: (value: string, field: FormField) => {
      let result: ValidResult = { name: field.name, constraint: [] };
      return regexpValidator(value, field, result);
    },
  };
}
