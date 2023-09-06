import { FieldStyle, FormField } from "@t/FormField";
import utils from "./utils";
import { FIELD_POSITION_STYLE, TEXT_ALIGN } from "src/constants";
import { FormOptions } from "@t/FormOptions";

export default {
  fieldStyle(field: FormField, beforeFieldStyle?: FieldStyle): FieldStyle {
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

    if (field.viewMode === "horizontal") {
      fieldStyle.rowStyleClass = "horizontal";
    } else {
      fieldStyle.rowStyleClass = "vertical";
    }

    let width = field.style?.width;

    let positionArr = FIELD_POSITION_STYLE[field.style?.position] || FIELD_POSITION_STYLE["top"];
    fieldStyle.fieldClass = positionArr[0];
    if (width) {
      if (utils.isNumber(width)) {
        fieldStyle.fieldClass += " col-xs-" + width;
      } else {
        fieldStyle.fieldStyle = `width:${width};`;
      }
    }

    let defaultLabelWidth = "3";
    let defaultValueWidth = "9";
    if (beforeFieldStyle) {
      fieldStyle.labelClass = beforeFieldStyle?.labelClass || "";
      fieldStyle.labelStyle = beforeFieldStyle?.labelStyle || "";
      defaultLabelWidth = "";
      defaultValueWidth = "";
    }

    let labelWidth = field.style?.labelWidth || defaultLabelWidth;
    let valueWidth = field.style?.valueWidth || defaultValueWidth;
    fieldStyle.labelClass = positionArr[1];
    if (labelWidth) {
      if (utils.isNumber(labelWidth)) {
        fieldStyle.labelClass += " col-xs-" + labelWidth;
      } else {
        fieldStyle.labelStyle = `width:${labelWidth};`;
      }
    }

    fieldStyle.valueClass = beforeFieldStyle?.valueClass || "";
    fieldStyle.valueStyle = beforeFieldStyle?.valueStyle || "";
    if (valueWidth) {
      if (utils.isNumber(valueWidth)) {
        fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : "col-xs-" + valueWidth;
      } else {
        fieldStyle.valueStyle = `width:${valueWidth};`;
      }
    } else {
      fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : beforeFieldStyle?.valueClass || "";
    }

    return fieldStyle;
  },

  /**
   * text aling style
   *
   * @param {FormField} filed
   * @param {(FormField | null)} parentField
   * @returns {string} style class
   */
  getTextAlignStyle(opts: FormOptions, filed: FormField, parentField: FormField | null, isGroupChild?: boolean): string {
    let labelAlign;
    if (isGroupChild) {
      labelAlign = filed.style?.labelAlign;
      if (utils.isUndefined(labelAlign)) {
        return "";
      }
    } else {
      labelAlign = filed.style?.labelAlign ? filed.style.labelAlign : parentField?.style?.labelAlign || opts.style.lableAlign;
    }

    let labelAlignStyleClass;
    if (Object.keys(TEXT_ALIGN).includes(labelAlign)) {
      labelAlignStyleClass = TEXT_ALIGN[labelAlign];
    } else {
      labelAlignStyleClass = TEXT_ALIGN.left;
    }

    return `txt-${labelAlignStyleClass}`;
  },
};
