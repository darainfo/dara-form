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
  viewMode: "horizontal", // horizontal , vertical // 가로 세로 모드
  style: {
    width: "100%",
    labelWidth: 3,
    valueWidth: 9,
    lableAlign: TEXT_ALIGN.left,
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

  private formElement;

  private fieldInfoMap;

  private formValue: any = {};

  private addRowFields: string[] = [];

  constructor(selector: string, options: FormOptions, message: Message) {
    this.options = Object.assign({}, defaultOptions, options);

    daraFormIdx += 1;

    Lanauage.set(message);

    this.fieldInfoMap = new FieldInfoMap(selector);

    const formElement = document.querySelector(selector);
    if (formElement) {
      formElement.className = `dara-form df-${daraFormIdx}`;
      formElement.setAttribute("style", `width:${this.options.style.width};`);

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

    //console.log(rednerTemplate);

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
    let fieldStyle: FieldStyle = styleUtils.fieldStyle(field);
    fieldStyle.labelAlignClass = styleUtils.getTextAlignStyle(this.options, field, null);

    const template = [];

    let fieldTemplate = "";

    if (field.children) {
      if (!utils.isUndefined(field.name)) {
        fieldTemplate = this.getFieldTempate(field);
      }
      fieldTemplate += this.childTemplate(field, fieldStyle);
    } else {
      fieldTemplate = this.getFieldTempate(field);
    }

    let labelHideFlag = this.isLabelHide(field);

    template.push(`
        <div class="df-row ${fieldStyle.fieldClass}" id="${field.$key}">
          ${labelHideFlag ? "" : `<div class="df-label ${fieldStyle.labelClass}" style="${fieldStyle.labelStyle}">${this.getLabelTemplate(field)}</div>`}

          <div class="df-field-container ${fieldStyle.valueClass} ${field.required ? "required" : ""}">
              ${fieldTemplate}
          </div>
        </div>
    `);

    return template.join("");
  }
  public childTemplate(field: FormField, parentFieldStyle: FieldStyle) {
    const template = [];

    let beforeFieldStyle: FieldStyle = {};
    let firstFlag = true;
    let isEmptyLabel = false;
    template.push(`<div class="df-row ${parentFieldStyle.rowStyleClass}">`);
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

      let childFieldStyle: FieldStyle = styleUtils.fieldStyle(childField, beforeFieldStyle);

      childFieldStyle.labelAlignClass = styleUtils.getTextAlignStyle(this.options, childField, field, true);

      if (utils.isBlank(childFieldStyle.labelAlignClass)) {
        childFieldStyle.labelAlignClass = beforeFieldStyle?.labelAlignClass || "";
      } else if (firstFlag) {
        beforeFieldStyle = childFieldStyle;
      }

      let labelHideFlag = this.isLabelHide(childField);

      template.push(`<div class="form-group ${childFieldStyle.fieldClass}" style="${childFieldStyle.fieldStyle}" id="${childField.$key}">
        ${
          labelHideFlag
            ? isEmptyLabel
              ? `<span class="df-label ${childFieldStyle.labelClass}" style="${childFieldStyle.labelStyle}"></span>`
              : ""
            : `<span class="df-label ${childFieldStyle.labelClass} ${childFieldStyle.labelAlignClass}" style="${childFieldStyle.labelStyle}">${this.getLabelTemplate(childField)}</span>`
        }
        <span class="df-field-container ${childFieldStyle.valueClass}" ${childField.required ? "required" : ""}">${childTempate}</span>
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
   * label 숨김 여부
   *
   * @param field formfield
   * @returns
   */
  private isLabelHide(field: FormField): boolean {
    return field.style?.labelHide || (utils.isUndefined(field.label) ? true : false);
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
