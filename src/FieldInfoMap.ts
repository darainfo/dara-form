import { FIELD_PREFIX } from "src/constants";
import { FormField } from "./types/FormField";
import { ValidResult } from "./types/ValidResult";
import { getRenderer } from "./util/renderFactory";
import Lanauage from "./util/Lanauage";
import * as utils from "./util/utils";
import DaraForm from "./DaraForm";

interface NumberFieldMap {
  [key: string]: FormField;
}

interface StringNumberMap {
  [key: string]: string;
}

export default class FieldInfoMap {
  private fieldIdx = 0;

  private allFieldInfo: NumberFieldMap = {};

  private keyNameMap: StringNumberMap = {};

  private conditionFields: string[] = [];

  private fieldPrefix;

  private form;

  constructor(selector: string, form: DaraForm) {
    this.fieldPrefix = `${FIELD_PREFIX}_${utils.getHashCode(selector)}`;
    this.form = form;
  }

  /**
   * add Field 정보
   *
   * @public
   * @param {FormField} field 폼필드 정보
   */
  public addField(field: FormField) {
    utils.replaceXssField(field);
    this.fieldIdx += 1;
    field.$key = `${this.fieldPrefix}_${this.fieldIdx}`;
    field.$validName = field.name ?? field.label;
    this.keyNameMap[field.$validName] = field.$key;
    this.allFieldInfo[field.$key] = field;
    field.$renderType = getRenderer(field);

    if (field.conditional) {
      this.conditionFields.push(field.$key);
    }
  }

  /**
   * 필드명으로 필드 정부 구하기
   *
   * @public
   * @param {string} fieldName 필드명
   * @returns {FormField}
   */
  public getFieldName(fieldName: string): FormField {
    return this.allFieldInfo[this.keyNameMap[fieldName]];
  }

  /**
   * 필드 키로 정보 구하기
   *
   * @public
   * @param {string} fieldKey
   * @returns {FormField}
   */
  public get(fieldKey: string): FormField {
    return this.allFieldInfo[fieldKey];
  }

  /**
   * 필드명 있는지 여부 체크.
   *
   * @public
   * @param {string} fieldName 필드명
   * @returns {boolean}
   */
  public hasFieldName(fieldName: string): boolean {
    if (this.keyNameMap[fieldName] && this.allFieldInfo[this.keyNameMap[fieldName]]) {
      return true;
    }

    return false;
  }

  /**
   * 모든 필드 정보
   *
   * @public
   * @returns {NumberFieldMap}
   */
  public getAllFieldInfo(): NumberFieldMap {
    return this.allFieldInfo;
  }

  /**
   * 필드 정보 맵에서 지우기
   *
   * @public
   * @param {string} fieldName
   */
  public removeFieldInfo(fieldName: string) {
    delete this.allFieldInfo[this.keyNameMap[fieldName]];
  }

  /**
   * 모든 필드값 구하기
   *
   * @public
   * @param {boolean} validationCheck
   * @returns {*}
   */
  public getAllFieldValue(formValue: any, validationCheck: boolean) {
    const useTypeValue = this.form.getOptions().useTypeValue;

    if (validationCheck !== true) {
      for (let [key, fieldInfo] of Object.entries(this.allFieldInfo)) {
        formValue = addFormValue(formValue, fieldInfo, useTypeValue);
      }
      return formValue;
    }

    return new Promise((resolve, reject) => {
      for (let [key, fieldInfo] of Object.entries(this.allFieldInfo)) {
        if (!this.isValueFieldCheck(fieldInfo)) {
          continue;
        }

        let fieldValid = this.getFieldValidation(fieldInfo, true);

        if (fieldValid !== true) {
          reject(new Error(fieldValid.message, { cause: fieldValid }));
          return;
        }

        formValue = addFormValue(formValue, fieldInfo, useTypeValue);
      }

      resolve(formValue);
    });
  }

  public getFormDataValue(formValue: any, validationCheck: boolean) {
    if (validationCheck !== true) {
      let reval = new FormData();

      for (let [key, value] of Object.entries(formValue)) {
        reval.set(key, value as any);
      }

      for (let [key, fieldInfo] of Object.entries(this.allFieldInfo)) {
        addFieldFormData(reval, fieldInfo, fieldInfo.$instance.getValue());
      }

      return reval;
    }

    return new Promise((resolve, reject) => {
      let reval = new FormData();

      for (let [key, value] of Object.entries(formValue)) {
        reval.set(key, value as any);
      }

      for (let [key, fieldInfo] of Object.entries(this.allFieldInfo)) {
        if (!this.isValueFieldCheck(fieldInfo)) {
          continue;
        }

        let fieldValid = this.getFieldValidation(fieldInfo, true);

        if (fieldValid !== true) {
          reject(new Error(fieldValid.message, { cause: fieldValid }));
          return;
        }

        addFieldFormData(reval, fieldInfo, fieldInfo.$instance.getValue());
      }

      resolve(reval);
    });
  }

  /**
   *
   *
   * @param field
   * @returns
   */
  public isValueFieldCheck(field: FormField) {
    let parent = field;

    while (typeof parent !== "undefined") {
      if (!this.isConditionField(parent)) {
        return false;
      }

      parent = parent.$parent;
    }

    return true;
  }

  /**
   * field 활성 비활성화 여부.
   *
   * @param field form field
   * @returns
   */
  public isConditionField(field: FormField) {
    if (!this.conditionFields.includes(field.$key)) {
      return true;
    }

    let condFlag = false;

    if (field.conditional.custom) {
      condFlag = field.conditional.custom.call(null, field);
    } else {
      if (field.conditional.field) {
        const condField = this.getFieldName(field.conditional.field);

        if (condField) {
          if (field.conditional.eq == condField.$instance.getValue()) {
            condFlag = true;
          }
        }
      }
    }

    return condFlag;
  }

  /**
   * 컬럼 로우 보이고 안보이기 체크.
   *
   * @public
   */
  public conditionCheck() {
    this.conditionFields.forEach((fieldKey) => {
      const fieldInfo = this.allFieldInfo[fieldKey];

      let condFlag = this.isConditionField(fieldInfo);

      if (condFlag) {
        fieldInfo.$instance.show();
      } else {
        fieldInfo.$instance.hide();
      }
    });
  }

  /**
   * field validation check
   *
   * @param fieldInfo FormField
   * @returns boolean true or ValidResult
   */
  public getFieldValidation(fieldInfo: FormField, focusFlag: boolean | undefined) {
    const renderInfo = fieldInfo.$instance;
    let fieldValid = renderInfo.valid();

    if (fieldValid === true) return true;

    if (focusFlag) {
      renderInfo.focus();
    }
    fieldValid = fieldValid as ValidResult;
    if (utils.isUndefined(fieldValid.message)) {
      fieldValid.message = Lanauage.validMessage(fieldInfo, fieldValid)[0];
    }

    return fieldValid;
  }
}

/**
 * add form value
 * @param formData {Object} return Object value
 * @param fieldInfo {FormField} field info
 * @param fieldValue {any} form value
 */
function addFormValue(formData: any, fieldInfo: FormField, useTypeValue?: boolean) {
  if (utils.ignoreValueField(fieldInfo)) {
    return formData;
  }

  const fieldValue = fieldInfo.$instance.getValue();

  if (fieldInfo.renderType === "file") {
    const uploadFiles = fieldValue["uploadFile"];

    formData[fieldInfo.$validName] = uploadFiles;
    formData[fieldInfo.$validName + "RemoveIds"] = fieldValue["removeIds"];
  } else {
    if (useTypeValue !== true) {
      if (utils.isTabType(fieldInfo)) {
        for (let [key, value] of Object.entries(fieldValue)) {
          formData[key] = value;
        }
      } else {
        if (!utils.isEmpty(fieldInfo.name)) {
          formData[fieldInfo.name] = fieldValue;
        }
      }
    } else {
      formData[fieldInfo.$validName] = fieldValue;
    }
  }

  return formData;
}

function addFieldFormData(formData: FormData, fieldInfo: FormField, useTypeValue?: boolean) {
  if (utils.ignoreValueField(fieldInfo)) {
    return formData;
  }

  const fieldValue = fieldInfo.$instance.getValue();

  if (fieldInfo.renderType === "file") {
    const uploadFiles = fieldValue["uploadFile"];
    formData.delete(fieldInfo.$validName);
    for (let uploadFile of uploadFiles) {
      formData.append(fieldInfo.$validName, uploadFile);
    }

    formData.set(fieldInfo.$validName + "RemoveIds", fieldValue["removeIds"]);
  } else {
    if (useTypeValue !== true) {
      if (utils.isTabType(fieldInfo)) {
        for (let [key, value] of Object.entries(fieldValue)) {
          formData.set(key, value as any);
        }
      } else {
        if (!utils.isEmpty(fieldInfo.name)) {
          formData.set(fieldInfo.$validName, fieldValue);
        }
      }
    } else {
      formData.set(fieldInfo.$validName, fieldValue);
    }
  }

  return formData;
}
