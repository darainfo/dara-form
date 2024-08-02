import { FormOptions } from "@t/FormOptions";
import { FormField } from "@t/FormField";
import * as utils from "./util/utils";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
import Lanauage from "./util/Lanauage";
import { stringValidator } from "./rule/stringValidator";
import { numberValidator } from "./rule/numberValidator";
import { regexpValidator } from "./rule/regexpValidator";
import FieldInfoMap from "src/FieldInfoMap";
import FormTemplate from "./FormTemplate";
import { FORM_MODE } from "./constants";

declare const APP_VERSION: string;

const defaultOptions = {
  style: {
    width: "100%",
    labelWidth: 3,
    valueWidth: 9,
    position: "left-right",
  },
  mode: "new",
  autoCreate: true,
  notValidMessage: "This form is not valid.",
  fields: [],
} as FormOptions;

interface FieldMap {
  [key: string]: FormField;
}

interface DaraFormMap {
  [key: string]: DaraForm;
}

// all instance
const allInstance: DaraFormMap = {};

const SEQ_ATTR_KEY = "data-form-uid";

let DARA_FORM_SEQ = 0;
/**
 * DaraForm class
 *
 * @class DaraForm
 * @typedef {DaraForm}
 */
export default class DaraForm {
  public static VERSION = `${APP_VERSION}`;

  private readonly options;

  private orginFormStyleClass;

  private selector: string;
  private formElement: Element;

  private fieldInfoMap: FieldInfoMap;

  private formValue: any = {};

  public formTemplate: FormTemplate;

  constructor(formElement: Element, options: FormOptions, message?: Message) {
    this.options = utils.merge({}, defaultOptions, options) as FormOptions;

    Lanauage.set(message);

    if (formElement) {
      this.orginFormStyleClass = formElement.className;
      formElement.classList.add("dara-form");
      this.selector = `df_${++DARA_FORM_SEQ}`;
      formElement.setAttribute(SEQ_ATTR_KEY, this.selector);

      if (this.options.style.width) {
        formElement.setAttribute("style", `width:${this.options.style.width};`);
      }

      this.formElement = formElement;
      this.changeMode(this.options.mode ?? "new");
      this.createForm(this.options.fields);

      if (this.options.autoCreate !== false) {
        allInstance[this.selector] = this;
      }
    } else {
      throw new Error(`${formElement} form selector not found`);
    }
  }

  public static setMessage(message: Message): void {
    Lanauage.set(message);
  }

  private createForm(fields: FormField[]) {
    this.fieldInfoMap = new FieldInfoMap(this.selector);
    //this.formElement.innerHTML = "";
    this.formTemplate = new FormTemplate(this, this.formElement, this.fieldInfoMap);

    if (this.options.autoCreate === false) {
      return;
    }

    fields.forEach((field) => {
      this.formTemplate.addRow(field);
    });
    this.conditionCheck();

    if (this.options.onMounted) {
      this.options.onMounted.call(this);
    }
  }

  /**
   * change mode
   *
   * @param mode form_mode default new
   */
  public changeMode = (mode: FORM_MODE): void => {
    this.options.mode = mode;
    this.formElement.setAttribute("data-df-mode", mode);
  };

  /**
   * 폼 데이터 reset
   */
  public resetForm = () => {
    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const seq in fieldMap) {
      const fieldInfo = fieldMap[seq];
      const renderInfo = fieldInfo.$instance;

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
    this.fieldInfoMap.getFieldName(fieldName).$instance.reset();
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

    if (field?.$instance) {
      return field.$instance.getElement();
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
      return field.$instance.getValue();
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
  public setValue = (values: any, clear?: boolean | undefined) => {
    if (clear !== false) {
      this.resetForm();
    }

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
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (fieldInfo) {
      fieldInfo.$instance.setValue(value);
    }
  }

  public setFieldItems = (fieldName: string, values: any) => {
    const field = this.fieldInfoMap.getFieldName(fieldName);

    if (field) {
      return field.$instance.setValueItems(values);
    }
  };

  /**
   * field 추가
   *
   * @param {FormField} field
   */
  public addField = (field: FormField) => {
    this.options.fields.push(field);
    this.formTemplate.addRow(field);
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
    }

    this.fieldInfoMap.removeFieldInfo(fieldName);
  };

  /**
   * 폼 유효성 검증 여부
   *
   * @returns {boolean}
   */
  public isValidForm = (): boolean => {
    const result = this.validForm();
    return result.length < 1;
  };

  /**
   * 유효성 검증 폼 검증여부 리턴
   *
   * @returns {any[]}
   */
  public validForm = (): any[] => {
    let validResult = [] as any;
    let autoFocusFlag = this.options.autoFocus !== false;
    let firstFlag = true;

    const fieldMap = this.fieldInfoMap.getAllFieldInfo();
    for (const fieldKey in fieldMap) {
      const fieldInfo = fieldMap[fieldKey];

      let fieldValid = this.fieldInfoMap.getFieldValidation(fieldInfo, autoFocusFlag);

      if (fieldValid !== true) {
        autoFocusFlag = false;

        if (utils.isGridType(fieldInfo)) {
          validResult = validResult.concat(fieldValid);
        } else {
          if (firstFlag) {
            this.validTabCheck(fieldInfo);
            firstFlag = false;
          }
          validResult.push(fieldValid);
        }
      }
    }

    return validResult;
  };

  private validTabCheck(fieldInfo: FormField) {
    if (fieldInfo.$parent) {
      if (fieldInfo.$parent.renderType == "tab") {
        fieldInfo.$parent.$instance.setActive(fieldInfo.$key);
      }
      this.validTabCheck(fieldInfo.$parent);
    }
  }

  public isValidField = (fieldName: string): boolean => {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);

    if (utils.isUndefined(fieldInfo)) {
      throw new Error(`Field name [${fieldName}] not found`);
    }

    const renderInfo = fieldInfo.$instance;
    if (renderInfo) {
      return renderInfo.valid() === true;
    }

    return true;
  };

  /**
   * 설정 옵션 얻기
   */
  public getOptions = () => {
    return this.options;
  };

  public conditionCheck() {
    this.fieldInfoMap.conditionCheck();
  }

  public setFieldDisabled(fieldName: string, flag: boolean) {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);
    fieldInfo.$instance.setDisabled(flag);
  }

  /**
   * 설명 추가
   *
   * @public
   * @param {string} fieldName
   * @param {string} desc
   */
  public setFieldDescription(fieldName: string, desc: string) {
    const fieldInfo = this.fieldInfoMap.getFieldName(fieldName);
    fieldInfo.$instance.setDescription(desc);
  }

  public destroy = () => {
    this.formElement.className = this.orginFormStyleClass;
    this.formElement.replaceChildren();

    for (const key in this) {
      if (utils.hasOwnProp(this, key)) {
        delete this[key];
        delete allInstance[this.selector];
      }
    }
  };

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

  public static instance(ele: Element | String) {
    let element;
    if (utils.isString(ele)) {
      element = document.querySelector(ele);
    } else {
      element = ele;
    }
    element = element as Element;
    let selector = element.getAttribute(SEQ_ATTR_KEY);

    if (utils.isUndefined(selector) || utils.isBlank(selector)) {
      const keys = Object.keys(allInstance);
      if (keys.length > 1) {
        throw new Error(`selector empty : [${selector}]`);
      }
      selector = keys[0];

      return allInstance[selector];
    }
  }
  /**
   * 모든 field 얻기
   */
  public getFields = (): any[] => {
    return this.options.fields;
  };

  /**
   * field setting
   * @param fields
   */
  public setFields = (fields: any[]) => {
    this.options.fields = fields;
    this.createForm(fields);
  };

  public getFieldInfoMap() {
    return this.fieldInfoMap;
  }
}
