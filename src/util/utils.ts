import { FormField } from "@t/FormField";

const xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
} as any;

export default {
  replace(inputText: string): string {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(key, xssFilter[key]);
      });
    }
    return returnText;
  },

  unReplace(inputText: string): string {
    let returnText = inputText;

    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(xssFilter[key], key);
      });
    }
    return returnText;
  },

  unFieldName(fieldName: string): string {
    if (fieldName) {
      return this.unReplace(fieldName).replaceAll('"', '\\"');
    }
    return "";
  },

  isBlank(value: any): boolean {
    if (value === null) return true;
    if (value === "") return true;
    if (typeof value === "undefined") return true;
    if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === "")) return true;

    return false;
  },

  isUndefined(value: any): value is undefined {
    return typeof value === "undefined";
  },

  isFunction(value: any): boolean {
    return typeof value === "function";
  },

  isString(value: any): value is string {
    return typeof value === "string";
  },
  isNumber(value: any): value is number {
    if (this.isBlank(value)) {
      return false;
    }
    return !isNaN(value);
  },

  isArray(value: any): value is Array<any> {
    return Array.isArray(value);
  },

  replaceXssField(field: FormField): FormField {
    field.name = this.replace(field.name);
    field.label = this.replace(field.label);
    return field;
  },

  getHashCode(str: string) {
    let hash = 0;
    if (str.length == 0) return hash;
    for (let i = 0; i < str.length; i++) {
      let tmpChar = str.charCodeAt(i);
      hash = (hash << 5) - hash + tmpChar;
      hash = hash & hash;
    }
    return hash;
  },

  isHiddenField(field: FormField): boolean {
    if (field.renderType === "hidden") {
      return true;
    }
    return false;
  },
};
