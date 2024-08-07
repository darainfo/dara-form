import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { regexpValidator } from "./regexpValidator";
import * as utils from "src/util/utils";

/**
 *  validator  ,  regexp 체크 .
 *
 * @param {string} value field value
 * @param {FormField} field field 정보
 * @param {ValidResult} result
 * @returns {(ValidResult | boolean)}
 */
export const validator = (value: string, field: FormField, result: ValidResult): ValidResult | boolean => {
  if (field.validator) {
    result.validator = field.validator(field, value);
    if (typeof result.validator === "object") {
      return result;
    }
  }

  result = regexpValidator(value, field, result);

  if (result.regexp) {
    return result;
  }

  if (field.different) {
    const diffFieldName = field.different.field;
    const diffField = field.$instance.getForm().getField(diffFieldName);

    if (!utils.isEmpty(diffField) && field.$instance.getValue() == diffField.$instance.getValue()) {
      result.message = field.different.message;
      return result;
    }
  }

  if (field.identical) {
    const diffFieldName = field.identical.field;
    const diffField = field.$instance.getForm().getField(diffFieldName);

    if (!utils.isEmpty(diffField) && field.$instance.getValue() != diffField.$instance.getValue()) {
      result.message = field.identical.message;
      return result;
    }
  }

  return true;
};
