import { FieldStyle, FormField } from "@t/FormField";
import utils from "./utils";
import { FIELD_POSITION_STYLE, TEXT_ALIGN } from "src/constants";
import { FormOptions } from "@t/FormOptions";

export default {
  /**
   * field style 처리
   *
   * @param formOptions FormOptions
   * @param field FormField
   * @param beforeField FormField
   * @returns FieldStyle
   */
  fieldStyle(formOptions: FormOptions, field: FormField, beforeField?: FormField | null): FieldStyle {
    let fieldStyle: FieldStyle = {
      rowStyleClass: "",
      fieldClass: "",
      fieldStyle: "",
      labelClass: "",
      labelStyle: "",
      labelAlignClass: "",
      valueClass: "",
      valueStyle: "",
    };

    if (field.orientation === "horizontal") {
      fieldStyle.rowStyleClass = "horizontal";
    } else {
      fieldStyle.rowStyleClass = "vertical";
    }

    let defaultLabelWidth = formOptions.style.labelWidth || "3";
    let defaultValueWidth = formOptions.style.valueWidth || "9";
    let boforePostion = formOptions.style.position;
    if (beforeField) {
      defaultLabelWidth = beforeField.style?.labelWidth || defaultLabelWidth;
      defaultValueWidth = beforeField.style?.valueWidth || defaultValueWidth;
      boforePostion = beforeField.style?.position || boforePostion;
    }

    let width = field.style?.width;

    let positionArr = FIELD_POSITION_STYLE[field.style?.position] || FIELD_POSITION_STYLE[boforePostion] || FIELD_POSITION_STYLE["top"];

    fieldStyle.fieldClass = positionArr[0] + " " + (field.style?.customClass || "");
    if (width) {
      if (utils.isNumber(width)) {
        fieldStyle.fieldClass += " col-xs-" + width;
      } else {
        fieldStyle.fieldStyle = `width:${width};`;
      }
    }

    let labelWidth = field.style?.labelWidth || defaultLabelWidth;
    fieldStyle.labelAlignClass = positionArr[1];

    if (labelWidth) {
      if (utils.isNumber(labelWidth)) {
        labelWidth = +labelWidth;
        defaultValueWidth = 12 - labelWidth + ""; // grid 12에서 value를 label 나머지 값으로  처리.
        fieldStyle.labelClass += " col-xs-" + labelWidth;
      } else {
        fieldStyle.labelStyle = `width:${labelWidth};`;
      }
    }

    let valueWidth = field.style?.valueWidth || defaultValueWidth;

    if (valueWidth) {
      if (utils.isNumber(valueWidth)) {
        fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : "col-xs-" + valueWidth;
      } else {
        fieldStyle.valueStyle = `width:${valueWidth};`;
      }
    } else {
      fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : "";
    }
    fieldStyle.fieldClass = spaceReplace(fieldStyle.fieldClass);
    fieldStyle.labelClass = spaceReplace(fieldStyle.labelClass || "");
    fieldStyle.valueClass = spaceReplace(fieldStyle.valueClass || "");

    return fieldStyle;
  },
};

function spaceReplace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}
