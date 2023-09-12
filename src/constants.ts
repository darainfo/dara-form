import NumberRender from "src/renderer/NumberRender";
import TextAreaRender from "src/renderer/TextAreaRender";
import DropdownRender from "src/renderer/DropdownRender";
import TextRender from "src/renderer/TextRender";
import CheckboxRender from "src/renderer/CheckboxRender";
import RadioRender from "src/renderer/RadioRender";
import PasswordRender from "src/renderer/PasswordRender";
import FileRender from "src/renderer/FileRender";
import CustomRender from "./renderer/CustomRender";
import GroupRender from "./renderer/GroupRender";
import HiddenRender from "./renderer/HiddenRender";
import ButtonRender from "./renderer/ButtonRender";
import RangeRender from "./renderer/RangeRender";
import DateRender from "./renderer/DateRender";
import TabRender from "./renderer/TabRender";

export const RULES = {
  NAN: "nan",
  MIN: "minimum",
  EXCLUSIVE_MIN: "exclusiveMinimum",
  MAX: "maximum",
  EXCLUSIVE_MAX: "exclusiveMaximum",
  MIN_LENGTH: "minLength",
  MAX_LENGTH: "maxLength",
  BETWEEN: "between",
  BETWEEN_EXCLUSIVE_MIN: "betweenExclusiveMin",
  BETWEEN_EXCLUSIVE_MAX: "betweenExclusiveMax",
  BETWEEN_EXCLUSIVE_MINMAX: "betweenExclusiveMinMax",
  REGEXP: "regexp",
  REQUIRED: "required",
  VALIDATOR: "validator",
} as const;

export const FIELD_PREFIX = "dff"; // dara form field

export const RENDER_TEMPLATE: any = {
  number: NumberRender,
  textarea: TextAreaRender,
  dropdown: DropdownRender,
  checkbox: CheckboxRender,
  radio: RadioRender,
  text: TextRender,
  password: PasswordRender,
  file: FileRender,
  custom: CustomRender,
  group: GroupRender,
  hidden: HiddenRender,
  button: ButtonRender,
  range: RangeRender,
  date: DateRender,
  tab: TabRender,
};

export const TEXT_ALIGN = {
  left: "left",
  center: "center",
  right: "right",
} as const;

export type TEXT_ALIGN_TYPE = (typeof TEXT_ALIGN)[keyof typeof TEXT_ALIGN];

export type FORM_FIELD_TYPE = "number" | "string" | "array";

export type RENDER_TYPE = "number" | "text" | "file" | "textarea" | "dropdown" | "radio" | "checkbox" | "date" | "group" | "custom";

export type REGEXP_TYPE = "email" | "url" | "alpha" | "alpha-num";

export type PASSWORD_TYPE = "number" | "upper" | "upper-special" | "upper-special-number"; // 숫자 | 대문자 포함, 대문자 특수문자 포함, 대문자 특수문자 숫자

export type FIELD_POSITION = "top" | "left" | "left-left" | "left-right" | "right" | "right-left" | "right-right" | "bottom";

export type ORIENTATION_TYPE = "horizontal" | "vertical";

interface StringArrayMap {
  [key: string]: string[];
}

export const FIELD_POSITION_STYLE: StringArrayMap = {
  "top-left": ["top", "txt-left"],
  "top-center": ["top", "txt-center"],
  "top-right": ["top", "txt-right"],
  "left-left": ["", "txt-left"],
  "left-center": ["", "txt-center"],
  "left-right": ["", "txt-right"],
  "right-right": ["right", "txt-right"],
  "right-center": ["right", "txt-center"],
  "right-left": ["right", "txt-left"],
  "bottom-left": ["bottom", "txt-left"],
  "bottom-center": ["bottom", "txt-center"],
  "bottom-right": ["bottom", "txt-right"],
};
FIELD_POSITION_STYLE["top"] = FIELD_POSITION_STYLE["top-left"];
FIELD_POSITION_STYLE["right"] = FIELD_POSITION_STYLE["right-right"];
FIELD_POSITION_STYLE["left"] = FIELD_POSITION_STYLE["left-left"];
FIELD_POSITION_STYLE["bottom"] = FIELD_POSITION_STYLE["bottom-left"];
