import { FieldStyle, FormField } from "@t/FormField";
import utils from "./utils";
import { FIELD_POSITION_STYLE, ALIGN } from "src/constants";
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
  fieldStyle(formOptions: FormOptions, field: FormField, beforeField?: FormField | null, isLabelHide?: boolean): FieldStyle {
    const fieldStyle = {
      rowStyleClass: field.orientation === "horizontal" ? "horizontal" : "vertical",
      fieldClass: "",
      fieldStyle: "",
      labelClass: "",
      labelStyle: "",
      labelAlignClass: "",
      valueClass: "",
      valueStyle: "",
      tabAlignClass: "",
    };

    const defaultLabelWidth = beforeField?.style?.labelWidth ?? formOptions.style.labelWidth ?? "3";
    const defaultValueWidth = beforeField?.style?.valueWidth ?? formOptions.style.valueWidth ?? "9";
    const position = beforeField?.style?.position ?? formOptions.style.position;

    const width = field.style?.width;
    const positionArr = FIELD_POSITION_STYLE[field.style?.position] ?? FIELD_POSITION_STYLE[position] ?? FIELD_POSITION_STYLE.top;

    fieldStyle.fieldClass = `${positionArr[0]} ${field.style?.customClass || ""}`;
    if (width) {
      fieldStyle.fieldClass += utils.isNumber(width) ? ` col-xs-${width}` : "";
      fieldStyle.fieldStyle = utils.isNumber(width) ? "" : `width:${width};`;
    }

    fieldStyle.tabAlignClass = "tab-al-" + (["right", "center"].includes(field.style?.tabAlign) ? field.style.tabAlign : "left");

    const labelWidth = field.style?.labelWidth || defaultLabelWidth;
    fieldStyle.labelAlignClass = positionArr[1];

    if (!isLabelHide && labelWidth && !["top", "bottom"].includes(positionArr[0])) {
      if (utils.isNumber(labelWidth)) {
        const labelWidthValue = +labelWidth;
        fieldStyle.labelClass = `col-xs-${labelWidthValue}`;
        fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : `col-xs-${12 - labelWidthValue}`;
      } else {
        fieldStyle.labelStyle = `width:${labelWidth};`;
      }
    }

    const valueWidth = field.style?.valueWidth || defaultValueWidth;
    if (isLabelHide && !["left", "right"].includes(positionArr[0])) {
      fieldStyle.valueClass = "col-full";
    } else {
      if (valueWidth && !["top", "bottom"].includes(positionArr[0])) {
        if (utils.isNumber(valueWidth)) {
          fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : `col-xs-${valueWidth}`;
        } else {
          fieldStyle.valueStyle = `width:${valueWidth};`;
        }
      } else {
        fieldStyle.valueClass = fieldStyle.labelStyle ? "col-full" : "";
      }
    }

    fieldStyle.fieldClass = spaceReplace(fieldStyle.fieldClass);
    fieldStyle.labelClass = spaceReplace(fieldStyle.labelClass);
    fieldStyle.valueClass = spaceReplace(fieldStyle.valueClass);

    return fieldStyle;
  },
};

function spaceReplace(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}
