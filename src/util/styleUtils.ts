import { FieldStyle, FormField } from "@t/FormField";
import utils from "./utils";

export default {
  labelWidthStyle(field: FormField, beforeLabelWidth: string | number): FieldStyle {
    const fieldStyle = {
      clazz: "",
      style: "",
    };
    const labelWidth = field.style?.labelWidth ? field.style.labelWidth : beforeLabelWidth;
    if (utils.isNumber(labelWidth)) {
      fieldStyle.clazz = "col-xs-" + labelWidth;
    } else {
      fieldStyle.style = labelWidth ? `width:${labelWidth};` : "";
    }

    console.log(field, beforeLabelWidth, fieldStyle);

    return fieldStyle;
  },

  valueWidthStyle(field: FormField, beforeValueWidth: string | number): FieldStyle {
    const fieldStyle = {
      clazz: "",
      style: "",
    };

    const valueWidth = field.style?.valueWidth ? field.style.valueWidth : beforeValueWidth;
    if (utils.isNumber(valueWidth)) {
      fieldStyle.clazz = "col-xs-" + valueWidth;
    } else {
      fieldStyle.style = valueWidth ? `width:${valueWidth};` : "";
    }

    return fieldStyle;
  },
};
