"use strict";

// src/util/utils.ts
var xssFilter = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var utils_default = {
  replace(inputText) {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(key, xssFilter[key]);
      });
    }
    return returnText;
  },
  unReplace(inputText) {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter).forEach((key) => {
        returnText = returnText.replaceAll(xssFilter[key], key);
      });
    }
    return returnText;
  },
  unFieldName(fieldName) {
    if (fieldName) {
      return this.unReplace(fieldName).replaceAll('"', '\\"');
    }
    return "";
  },
  isBlank(value) {
    if (value === null)
      return true;
    if (value === "")
      return true;
    if (typeof value === "undefined")
      return true;
    if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === ""))
      return true;
    return false;
  },
  isUndefined(value) {
    return typeof value === "undefined";
  },
  isFunction(value) {
    return typeof value === "function";
  },
  isString(value) {
    return typeof value === "string";
  },
  isNumber(value) {
    if (this.isBlank(value)) {
      return false;
    }
    return !isNaN(value);
  },
  isArray(value) {
    return Array.isArray(value);
  },
  replaceXssField(field) {
    field.name = this.replace(field.name);
    field.label = this.replace(field.label);
    return field;
  },
  getHashCode(str) {
    let hash = 0;
    if (str.length == 0)
      return hash;
    for (let i = 0; i < str.length; i++) {
      let tmpChar = str.charCodeAt(i);
      hash = (hash << 5) - hash + tmpChar;
      hash = hash & hash;
    }
    return hash;
  },
  isHiddenField(field) {
    if (field.renderType === "hidden") {
      return true;
    }
    return false;
  }
};

// src/renderer/Render.ts
var Render = class _Render {
  constructor(form, field, rowElement) {
    this.daraForm = form;
    this.field = field;
    this.rowElement = rowElement;
    if (field.tooltip)
      rowElement.querySelector(".df-tooltip")?.setAttribute("tooltip", field.tooltip);
  }
  setDefaultInfo() {
    if (!utils_default.isUndefined(this.field.defaultValue)) {
      this.setValue(this.field.defaultValue);
    }
    if (!utils_default.isUndefined(this.field.placeholder)) {
      const ele = this.getElement();
      if (ele instanceof Element) {
        ele.setAttribute("placeholder", this.field.placeholder);
      }
    }
  }
  getForm() {
    return this.daraForm;
  }
  setValueItems(value) {
  }
  changeEventCall(field, e, rederInfo) {
    if (field.onChange) {
      let fieldValue = rederInfo.getValue();
      let changeValue = {
        field,
        evt: e
      };
      changeValue.value = fieldValue;
      if (field.listItem?.list) {
        let valuesItem = [];
        const valueKey = _Render.valuesValueKey(field);
        for (let val of field.listItem.list) {
          let changeVal = val[valueKey];
          if (utils_default.isString(fieldValue)) {
            if (changeVal == fieldValue) {
              valuesItem.push(val);
              break;
            }
          } else if (utils_default.isArray(fieldValue)) {
            if (fieldValue.includes(changeVal)) {
              valuesItem.push(val);
            }
          }
        }
        changeValue.valueItem = valuesItem;
      }
      field.onChange.call(null, changeValue);
    }
    this.daraForm.conditionCheck();
  }
  focus() {
    this.getElement().focus();
  }
  show() {
    this.rowElement.classList.remove("df-hidden");
  }
  hide() {
    if (!this.rowElement.classList.contains("df-hidden")) {
      this.rowElement.classList.add("df-hidden");
    }
  }
  setDisabled(flag) {
    const ele = this.getElement();
    if (ele instanceof HTMLElement) {
      if (flag === false) {
        this.getElement().removeAttribute("disabled");
      } else {
        this.getElement().setAttribute("disabled", true);
      }
    }
  }
  commonValidator() {
  }
  static valuesValueKey(field) {
    return field.listItem?.valueField ? field.listItem.valueField : "value";
  }
  static valuesLabelKey(field) {
    return field.listItem?.labelField ? field.listItem.labelField : "label";
  }
  static valuesLabelValue(label, val) {
    let replaceFlag = false;
    const resultValue = label.replace(/\{\{([A-Za-z0-9_.]*)\}\}/g, (match, key) => {
      replaceFlag = true;
      return val[key] || "";
    });
    if (replaceFlag) {
      return resultValue;
    }
    return val[label] || "";
  }
};

// src/rule/regexpValidator.ts
var regexp = {
  "mobile": /^\d{3}-\d{3,4}-\d{4}$/,
  "email": /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  "url": /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/,
  "number": /\d$/,
  "alpha": /^[a-zA-Z]+$/,
  "alpha-num": /^[a-zA-Z0-9]+$/,
  "variable": /^[a-zA-Z0-9_$][a-zA-Z0-9_$]*$/,
  "number-char": /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/,
  "upper-char": /^(?=.*?[A-Z])(?=.*?[a-z])/,
  "upper-char-special": /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-])/,
  "upper-char-special-number": /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/
};
var regexpValidator = (value, field, result) => {
  if (typeof result === "undefined") {
    result = { name: field.name, constraint: [] };
  }
  const regexpType = field.regexpType;
  if (regexpType) {
    if (!regexp[regexpType].test(value)) {
      result.regexp = regexpType;
      return result;
    }
  }
  return result;
};

// src/rule/validator.ts
var validator = (value, field, result) => {
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
    const diffField = field.$renderer.getForm().getField(diffFieldName);
    if (field.$renderer.getValue() == diffField.$renderer.getValue()) {
      result.message = field.different.message;
      return result;
    }
  }
  if (field.identical) {
    const diffFieldName = field.identical.field;
    const diffField = field.$renderer.getForm().getField(diffFieldName);
    if (field.$renderer.getValue() != diffField.$renderer.getValue()) {
      result.message = field.identical.message;
      return result;
    }
  }
  return true;
};

// src/rule/numberValidator.ts
var numberValidator = (value, field) => {
  const result = { name: field.name, constraint: [] };
  const numValue = Number(value);
  if (field.required && utils_default.isBlank(value)) {
    result.constraint.push(RULES.REQUIRED);
    return result;
  }
  if (!utils_default.isNumber(value)) {
    result.constraint.push(RULES.NAN);
    return result;
  }
  if (validator(value, field, result) !== true) {
    return result;
  }
  const rule = field.rule;
  if (rule) {
    const isMinimum = utils_default.isNumber(rule.minimum), isMaximum = utils_default.isNumber(rule.maximum);
    let minRule = false, minExclusive = false, maxRule = false, maxExclusive = false;
    if (isMinimum) {
      if (rule.exclusiveMinimum && numValue <= rule.minimum) {
        minExclusive = true;
      } else if (numValue < rule.minimum) {
        minRule = true;
      }
    }
    if (isMaximum) {
      if (rule.exclusiveMaximum && numValue >= rule.maximum) {
        maxExclusive = true;
      } else if (numValue > rule.maximum) {
        maxRule = true;
      }
    }
    if (isMinimum && isMaximum && (minRule || minExclusive || maxRule || maxExclusive)) {
      if (rule.exclusiveMinimum && rule.exclusiveMaximum && (minExclusive || maxExclusive)) {
        result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MINMAX);
      } else if (minExclusive) {
        result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MIN);
      } else if (maxExclusive) {
        result.constraint.push(RULES.BETWEEN_EXCLUSIVE_MAX);
      } else {
        result.constraint.push(RULES.BETWEEN);
      }
    } else {
      if (minExclusive) {
        result.constraint.push(RULES.EXCLUSIVE_MIN);
      }
      if (maxExclusive) {
        result.constraint.push(RULES.EXCLUSIVE_MAX);
      }
      if (minRule) {
        result.constraint.push(RULES.MIN);
      }
      if (maxRule) {
        result.constraint.push(RULES.MAX);
      }
    }
  }
  if (result.constraint.length > 0) {
    return result;
  }
  return true;
};

// src/util/validUtils.ts
var invalidMessage = (field, rowElement, validResult) => {
  if (validResult === true) {
    rowElement.classList.remove("invalid");
    if (!rowElement.classList.contains("valid")) {
      rowElement.classList.add("valid");
    }
    const helpMessageElement = rowElement.querySelector(".help-message");
    if (helpMessageElement) {
      helpMessageElement.innerHTML = "";
    }
    return;
  }
  rowElement.classList.remove("valid");
  if (!rowElement.classList.contains("invalid")) {
    rowElement.classList.add("invalid");
  }
  if (validResult !== false) {
    const message2 = Lanauage_default.validMessage(field, validResult);
    if (validResult.message) {
      message2.push(validResult.message);
    }
    const helpMessageElement = rowElement.querySelector(".help-message");
    if (helpMessageElement && message2.length > 0) {
      const msgHtml = [];
      message2.forEach((item) => {
        msgHtml.push(`<div>${item}</div>`);
      });
      helpMessageElement.innerHTML = msgHtml.join("");
    }
  }
};
var resetRowElementStyleClass = (rowElement) => {
  rowElement.classList.remove("invalid");
  rowElement.classList.remove("valid");
};

// src/event/renderEvents.ts
var inputEvent = (field, element, renderInfo) => {
  element.addEventListener("input", (e) => {
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });
};
var numberInputEvent = (field, element, renderInfo) => {
  element.addEventListener("keyup", (e) => {
    const val = e.target.value;
    if (!utils_default.isNumber(val)) {
      element.value = val.replace(/[^0-9\.\-\+]/g, "");
      e.preventDefault();
    }
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });
};
var dropdownChangeEvent = (field, element, renderInfo) => {
  element.addEventListener("change", (e) => {
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });
};
var customChangeEventCall = (field, e, renderInfo) => {
  renderInfo.changeEventCall(field, e, renderInfo);
};

// src/renderer/NumberRender.ts
var NumberRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    numberInputEvent(this.field, this.element, this);
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
        <div class="df-field">
            <input type="text" name="${field.name}" class="form-field number help-icon" />
        </div> 
        ${desc}
        <div class="help-message"></div>
       `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = numberValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/rule/stringValidator.ts
var stringValidator = (value, field) => {
  let result = { name: field.name, constraint: [] };
  if (field.required && utils_default.isBlank(value)) {
    result.constraint.push(RULES.REQUIRED);
    return result;
  }
  const validResult = validator(value, field, result);
  if (validResult !== true) {
    return validResult;
  }
  const rule = field.rule;
  if (rule) {
    const valueLength = value.length;
    const isMinNumber = utils_default.isNumber(rule.minLength), isMaxNumber = utils_default.isNumber(rule.maxLength);
    let minRule = false, maxRule = false;
    if (isMinNumber && valueLength < rule.minLength) {
      minRule = true;
    }
    if (isMaxNumber && valueLength > rule.maxLength) {
      maxRule = true;
    }
    if (isMinNumber && isMaxNumber && (minRule || maxRule)) {
      result.constraint.push(RULES.BETWEEN);
    } else {
      if (minRule) {
        result.constraint.push(RULES.MIN_LENGTH);
      }
      if (maxRule) {
        result.constraint.push(RULES.MAX_LENGTH);
      }
    }
    if (result.constraint.length > 0) {
      return result;
    }
  }
  return true;
};

// src/renderer/TextAreaRender.ts
var TextAreaRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    inputEvent(this.field, this.element, this);
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    let rows = field.customOptions?.rows;
    rows = +rows > 0 ? rows : 3;
    return `
            <div class="df-field">
                <textarea name="${field.name}" rows="${rows}" class="form-field textarea help-icon"></textarea>
            </div> 
            ${desc}
            <div class="help-message"></div>
        `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = stringValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/renderer/DropdownRender.ts
var DropdownRender = class _DropdownRender extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    if (!utils_default.isUndefined(field.defaultValue)) {
      this.defaultCheckValue = field.defaultValue;
    } else {
      const valueKey = _DropdownRender.valuesValueKey(field);
      this.field.listItem?.list?.forEach((val) => {
        if (val.selected) {
          this.defaultCheckValue = val[valueKey];
        }
      });
      if (!this.defaultCheckValue) {
        this.defaultCheckValue = this.field.listItem?.list?.length > 0 ? this.field.listItem?.list[0][valueKey] : "";
      }
    }
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    dropdownChangeEvent(this.field, this.element, this);
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    let template = ` <div class="df-field"><select name="${field.name}" class="form-field dropdown">;
          ${_DropdownRender.dropdownValuesTemplate(field)}
          </select> <i class="help-icon"></i></div>
                ${desc}
      <div class="help-message"></div>
    `;
    return template;
  }
  setValueItems(items) {
    this.field.listItem.list = items;
    this.element.innerHTML = _DropdownRender.dropdownValuesTemplate(this.field);
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue(this.defaultCheckValue);
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const value = this.getValue();
    let validResult = true;
    if (this.field.required) {
      if (value.length < 1) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
  static dropdownValuesTemplate(field) {
    const labelKey = this.valuesLabelKey(field);
    const valueKey = this.valuesValueKey(field);
    let template = "";
    field.listItem?.list?.forEach((val) => {
      template += `<option value="${val[valueKey]}" ${val.selected ? "selected" : ""}>${this.valuesLabelValue(labelKey, val)}</option>`;
    });
    return template;
  }
};

// src/renderer/TextRender.ts
var TextRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    inputEvent(this.field, this.element, this);
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
    <div class="df-field">
      <input type="text" name="${field.name}" class="form-field text help-icon" />
     </div>
     ${desc}
     <div class="help-message"></div>
     `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = stringValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/renderer/CheckboxRender.ts
var CheckboxRender = class _CheckboxRender extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.defaultCheckValue = [];
    this.defaultCheckValue = [];
    if (!utils_default.isUndefined(field.defaultValue)) {
      if (utils_default.isArray(field.defaultValue)) {
        this.defaultCheckValue = field.defaultValue;
      } else {
        this.defaultCheckValue = [field.defaultValue];
      }
    } else {
      const valueKey = _CheckboxRender.valuesValueKey(field);
      this.field.listItem?.list?.forEach((val) => {
        if (val.selected) {
          this.defaultCheckValue.push(val[valueKey] ? val[valueKey] : true);
        }
      });
    }
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
    checkboxes.forEach((ele) => {
      ele.addEventListener("change", (e) => {
        customChangeEventCall(this.field, e, this);
        this.valid();
      });
    });
  }
  getSelector() {
    return `input[type="checkbox"][name="${this.field.$xssName}"]`;
  }
  static template(field) {
    const templates = [];
    const fieldName = field.name;
    const desc = field.description ? `<div>${field.description}</div>` : "";
    const labelKey = this.valuesLabelKey(field);
    const valueKey = this.valuesValueKey(field);
    templates.push(` <div class="df-field"><div class="field-group">`);
    field.listItem?.list?.forEach((val) => {
      const checkVal = val[valueKey];
      templates.push(`
                <span class="field ${field.viewMode == "vertical" ? "vertical" : "horizontal"}">
                    <label>
                        <input type="checkbox" name="${fieldName}" value="${checkVal ? utils_default.replace(checkVal) : ""}" class="form-field checkbox" ${val.selected ? "checked" : ""}/>
                        ${this.valuesLabelValue(labelKey, val)}
                    </label>
                </span>
            `);
    });
    templates.push(`<i class="dara-icon help-icon"></i></div></div>
        ${desc}
        <div class="help-message"></div>
        `);
    return templates.join("");
  }
  setValueItems(items) {
    const containerEle = this.rowElement.querySelector(".df-field-container");
    if (containerEle) {
      this.field.listItem.list = items;
      containerEle.innerHTML = _CheckboxRender.template(this.field);
      this.initEvent();
    }
  }
  getValue() {
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
    if (checkboxes.length > 1) {
      const checkValue = [];
      checkboxes.forEach((ele) => {
        const checkEle = ele;
        if (checkEle.checked) {
          checkValue.push(checkEle.value);
        }
      });
      return checkValue;
    } else {
      const checkElement = this.rowElement.querySelector(`[name="${this.field.$xssName}"]`);
      if (checkElement.checked) {
        return checkElement.value ? checkElement.value : true;
      }
      return checkElement.value ? "" : false;
    }
  }
  setValue(value) {
    this.field.$value = value;
    if (value === true) {
      this.rowElement.querySelector(`[name="${this.field.$xssName}"]`).checked = true;
      return;
    }
    if (value === false) {
      this.rowElement.querySelector(`[name="${this.field.$xssName}"]`).checked = false;
      return;
    }
    let valueArr = [];
    if (Array.isArray(value)) {
      valueArr = value;
    } else {
      valueArr.push(value);
    }
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
    checkboxes.forEach((ele) => {
      ele.checked = false;
    });
    valueArr.forEach((val) => {
      const ele = this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${val}"]`);
      if (ele)
        ele.checked = true;
    });
  }
  reset() {
    if (this.field.listItem?.list?.length == 1 && this.defaultCheckValue.length == 1) {
      this.setValue(true);
    } else {
      this.setValue(this.defaultCheckValue);
    }
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`);
  }
  valid() {
    const value = this.getValue();
    let validResult = true;
    if (this.field.required && utils_default.isArray(value)) {
      if (value.length < 1) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/renderer/RadioRender.ts
var RadioRender = class _RadioRender extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.defaultCheckValue = [];
    if (!utils_default.isUndefined(field.defaultValue)) {
      this.defaultCheckValue = field.defaultValue;
    } else {
      const valueKey = _RadioRender.valuesValueKey(field);
      this.field.listItem?.list?.forEach((val) => {
        if (val.selected) {
          this.defaultCheckValue.push(val[valueKey]);
        }
      });
      if (!this.defaultCheckValue) {
        this.defaultCheckValue = this.field.listItem?.list?.length > 0 ? this.field.listItem?.list[0][valueKey] : "";
      }
    }
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
    checkboxes.forEach((ele) => {
      ele.addEventListener("change", (e) => {
        customChangeEventCall(this.field, e, this);
        this.valid();
      });
    });
  }
  getSelector() {
    return `input[type="radio"][name="${this.field.$xssName}"]`;
  }
  static template(field) {
    const templates = [];
    const fieldName = field.name;
    const desc = field.description ? `<div>${field.description}</div>` : "";
    const labelKey = this.valuesLabelKey(field);
    const valueKey = this.valuesValueKey(field);
    templates.push(`<div class="df-field"><div class="field-group">`);
    field.listItem?.list?.forEach((val) => {
      const radioVal = val[valueKey];
      templates.push(
        `<span class="field ${field.viewMode == "vertical" ? "vertical" : "horizontal"}">
                <label>
                    <input type="radio" name="${fieldName}" value="${radioVal}" class="form-field radio" ${val.selected ? "checked" : ""} />
                    ${this.valuesLabelValue(labelKey, val)}
                </label>
                </span>
                `
      );
    });
    templates.push(`<i class="dara-icon help-icon"></i></div></div>
        ${desc}
        <div class="help-message"></div>
         `);
    return templates.join("");
  }
  setValueItems(items) {
    const containerEle = this.rowElement.querySelector(".df-field-container");
    if (containerEle) {
      this.field.listItem.list = items;
      containerEle.innerHTML = _RadioRender.template(this.field);
      this.initEvent();
    }
  }
  getValue() {
    return this.rowElement.querySelector(`[name="${this.field.$xssName}"]:checked`)?.value;
  }
  setValue(value) {
    this.field.$value = value;
    if (value === true) {
      this.rowElement.querySelector(`[name="${this.field.$xssName}"]`).checked = true;
      return;
    }
    if (value === false) {
      this.rowElement.querySelector(`[name="${this.field.$xssName}"]`).checked = false;
      return;
    }
    const elements = this.rowElement.querySelectorAll(this.getSelector());
    elements.forEach((ele) => {
      let radioEle = ele;
      if (radioEle.value == value) {
        radioEle.checked = true;
      } else {
        radioEle.checked = false;
      }
    });
  }
  reset() {
    this.setValue(this.defaultCheckValue);
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.rowElement.querySelectorAll(this.getSelector());
  }
  valid() {
    const value = this.getValue();
    let validResult = true;
    if (this.field.required) {
      if (utils_default.isBlank(value)) {
        validResult = { name: this.field.name, constraint: [] };
        validResult.constraint.push(RULES.REQUIRED);
      }
    }
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/renderer/PasswordRender.ts
var PasswordRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    inputEvent(this.field, this.element, this);
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
            <div class="df-field">
                <input type="password" name="${field.name}" class="form-field password help-icon" autocomplete="off" />
            </div>
            ${desc}
            <div class="help-message"></div>
        `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = stringValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/rule/fileValidator.ts
var fileValidator = (element, field, fileList) => {
  const result = { name: field.name, constraint: [] };
  if (field.required && fileList.length < 1) {
    result.constraint.push(RULES.REQUIRED);
    return result;
  }
  if (result.constraint.length > 0) {
    return result;
  }
  return true;
};

// src/renderer/FileRender.ts
var FileRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.removeIds = [];
    this.uploadFiles = {};
    this.fileList = [];
    this.fileSeq = 0;
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.fileList = field.listItem?.list || [];
    this.initEvent();
  }
  initEvent() {
    this.element.addEventListener("change", (e) => {
      const files = e.target?.files;
      if (files) {
        this.addFiles(files);
      }
      customChangeEventCall(this.field, e, this);
      this.valid();
    });
    this.fileList.forEach((file) => {
      file.$seq = this.fileSeq += 1;
    });
    this.setFileList(this.fileList);
  }
  addFiles(files) {
    let addFlag = false;
    const newFiles = [];
    for (let item of files) {
      const fileCheckList = this.fileList.filter(
        (fileItem) => fileItem.fileName == item.name && fileItem.fileSize == item.size && fileItem.lastModified == item.lastModified
      );
      if (fileCheckList.length > 0)
        continue;
      this.fileSeq += 1;
      this.uploadFiles[this.fileSeq] = item;
      let newFileInfo = {
        fileName: item.name,
        $seq: this.fileSeq,
        fileSize: item.size,
        lastModified: item.lastModified
      };
      newFiles.push(newFileInfo);
      addFlag = true;
    }
    if (addFlag) {
      this.setFileList(newFiles);
      this.fileList.push(...newFiles);
    }
  }
  setFileList(fileList, initFlag) {
    const fileListElement = this.rowElement.querySelector(".dara-file-list");
    if (fileListElement) {
      if (initFlag === true) {
        fileListElement.innerHTML = "";
      }
      const fileTemplateHtml = [];
      fileList.forEach((file) => {
        fileTemplateHtml.push(`
        <div class="file-item" data-seq="${file.$seq}">
          ${file.fileId ? '<span class="file-icon download"></span>' : '<span class="file-icon"></span>'} <span class="file-icon remove"></span>
          <span class="file-name">${file.fileName}</span > 
        </div>`);
      });
      fileListElement.insertAdjacentHTML("beforeend", fileTemplateHtml.join(""));
      fileList.forEach((item) => {
        this.removeFileEvent(item, fileListElement);
        this.downloadFileEvent(item, fileListElement);
      });
    }
  }
  /**
   * 파일 다운로드 이벤트 처리.
   *
   * @param item
   * @param fileListElement
   */
  downloadFileEvent(item, fileListElement) {
    const ele = fileListElement.querySelector(`[data-seq="${item.$seq}"] .download`);
    if (ele) {
      ele.addEventListener("click", (evt) => {
        const fileItemElement = evt.target.closest(".file-item");
        if (fileItemElement) {
          const attrSeq = fileItemElement.getAttribute("data-seq");
          if (attrSeq) {
            const seq = parseInt(attrSeq, 10);
            const idx = this.fileList.findIndex((v) => v.$seq === seq);
            const item2 = this.fileList[idx];
            if (item2["url"]) {
              location.href = item2["url"];
              return;
            }
            if (this.field.fileDownload) {
              this.field.fileDownload.call(null, { file: item2, field: this.field });
              return;
            }
          }
        }
      });
    }
  }
  /**
   * 파일 삭제  처리.
   *
   * @param item
   * @param fileListElement
   */
  removeFileEvent(item, fileListElement) {
    const ele = fileListElement.querySelector(`[data-seq="${item.$seq}"] .remove`);
    if (ele) {
      ele.addEventListener("click", (evt) => {
        const fileItemElement = evt.target.closest(".file-item");
        if (fileItemElement) {
          const attrSeq = fileItemElement.getAttribute("data-seq");
          if (attrSeq) {
            const seq = parseInt(attrSeq, 10);
            const removeIdx = this.fileList.findIndex((v) => v.$seq === seq);
            const removeItem = this.fileList[removeIdx];
            this.fileList.splice(removeIdx, 1);
            delete this.uploadFiles[seq];
            fileItemElement.remove();
            if (removeItem.fileId) {
              this.removeIds.push(removeItem.fileId);
            }
          }
        }
        this.valid();
      });
    }
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
    <div class="df-field">
      <span class="file-wrapper">
        <label class="file-label">
          <input type="file" name="${field.name}" class="form-field file" multiple />
          ${Lanauage_default.getMessage("fileButton")}
        </label>
        <i class="dara-icon help-icon"></i>
      </span>
    </div>
    ${desc}
    <div class="dara-file-list"></div>
    <div class="help-message"></div>
    `;
  }
  getValue() {
    return {
      uploadFile: Object.values(this.uploadFiles),
      removeIds: this.removeIds
    };
  }
  setValueItems(value) {
    this.fileList = [];
    this.uploadFiles = [];
    this.removeIds = [];
    for (let file of value) {
      file.$seq = this.fileSeq += 1;
      this.fileList.push(file);
    }
    this.setFileList(this.fileList, true);
  }
  setValue(value) {
    this.element.value = "";
    this.field.$value = value;
  }
  reset() {
    this.setValue("");
    this.setValueItems([]);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = fileValidator(this.element, this.field, this.fileList);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/renderer/CustomRender.ts
var CustomRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.customFunction = field.renderer;
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    if (this.customFunction.initEvent) {
      this.customFunction.initEvent.call(this, this.field, this.rowElement);
    }
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    if (field.renderer.template) {
      return ` <div class="df-field">${field.renderer.template()}</div>
      ${desc}
        <div class="help-message"></div>`;
    }
    return "";
  }
  getValue() {
    if (this.customFunction.getValue) {
      return this.customFunction.getValue.call(this, this.field, this.rowElement);
    }
    return "";
  }
  setValue(value) {
    this.field.$value = value;
    if (this.customFunction.setValue) {
      this.customFunction.setValue.call(this, value, this.field, this.rowElement);
    }
  }
  reset() {
    this.setValue("");
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    if (this.customFunction.getElement) {
      return this.customFunction.getElement.call(this, this.field, this.rowElement);
    }
    return null;
  }
  valid() {
    if (this.customFunction.valid) {
      return this.customFunction.valid.call(this, this.field, this.rowElement);
    }
    return true;
  }
};

// src/renderer/GroupRender.ts
var GroupRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
  }
  initEvent() {
  }
  static template(field) {
    return "";
  }
  getValue() {
    return null;
  }
  setValue(value) {
  }
  reset() {
  }
  getElement() {
    return this.rowElement;
  }
  valid() {
    return true;
  }
};

// src/renderer/HiddenRender.ts
var HiddenRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.field.$value = field.defaultValue;
  }
  initEvent() {
  }
  static template(field) {
    return ``;
  }
  getValue() {
    return this.field.$value;
  }
  setValue(value) {
    this.field.$value = value;
  }
  reset() {
    this.setValue(this.field.defaultValue);
  }
  getElement() {
    return;
  }
  valid() {
    return true;
  }
};

// src/renderer/ButtonRender.ts
var ButtonRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.initEvent();
  }
  initEvent() {
    this.rowElement.querySelector(`#${this.field.$key}`)?.addEventListener("click", (evt) => {
      if (this.field.onClick) {
        this.field.onClick.call(null, this.field);
      }
    });
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
      <button type="button" id="${field.$key}" class="df-btn">${field.label}</button> ${desc}
     `;
  }
  getValue() {
    return "";
  }
  setValue(value) {
  }
  reset() {
    this.setDisabled(false);
  }
  getElement() {
    return null;
  }
  valid() {
    return true;
  }
};

// src/renderer/RangeRender.ts
var RangeRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.rangeNumElement = rowElement.querySelector(".range-num");
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    this.element.addEventListener("input", (e) => {
      this.rangeNumElement.innerHTML = e.target.value;
      this.element.setAttribute("title", e.target.value);
      customChangeEventCall(this.field, e, this);
      this.valid();
    });
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
        <div class="df-field">
            <span class="range-num">${field.defaultValue ? field.defaultValue : 0}</span>
            <input type="range" name="${field.name}" class="form-field range help-icon" min="${field.rule.minimum}" max="${field.rule.maximum}"/>
        </div> 
        ${desc}
        <div class="help-message"></div>
       `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = numberValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// node_modules/dara-datetimepicker/dist/index.js
var localeMessage = {
  year: "Year",
  month: "Month",
  day: "Day",
  am: "AM",
  pm: "PM",
  today: "Today",
  ok: "Ok",
  months: {
    full: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    abbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  },
  weeks: {
    full: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    abbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  }
};
var Language = class {
  constructor() {
    this.lang = localeMessage;
  }
  setDefaultMessage(lang) {
    localeMessage = Object.assign(localeMessage, lang);
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  set(lang) {
    this.lang = Object.assign({}, localeMessage, lang);
  }
  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  getMessage(messageKey) {
    return this.lang[messageKey];
  }
  getMonthsMessage(idx, mode = "abbr") {
    return this.lang.months[mode][idx] || "";
  }
  getWeeksMessage(idx, mode = "abbr") {
    return this.lang.weeks[mode][idx] || "";
  }
  getMonthsIdx(val, mode = "abbr") {
    return mode == "full" ? this.lang.months.full.indexOf(val) : this.lang.months.abbr.indexOf(val);
  }
  getWeeksIdx(val, mode = "abbr") {
    return mode == "full" ? this.lang.weeks.full.indexOf(val) : this.lang.weeks.abbr.indexOf(val);
  }
};
var Lanauage_default2 = new Language();
var EXPRESSIONS_FORMAT = [
  "YY",
  "YYYY",
  "MMMM",
  "MMM",
  "MM",
  "M",
  "dddd",
  "ddd",
  "dd",
  "d",
  "DD",
  "D",
  "S",
  "HH",
  "H",
  "hh",
  "h",
  "mm",
  "m",
  "ss",
  "s",
  "SSS",
  "zzzz",
  "zzz",
  "zz",
  "z",
  "a",
  "A"
];
var MAX_CHAR_LENGTH = 0;
var DEFAULT_DATE_FORMAT = "YYYY-MM-DD";
var DateViewMode = /* @__PURE__ */ ((DateViewMode2) => {
  DateViewMode2["year"] = "year";
  DateViewMode2["month"] = "month";
  DateViewMode2["date"] = "date";
  DateViewMode2["datetime"] = "datetime";
  DateViewMode2["time"] = "time";
  return DateViewMode2;
})(DateViewMode || {});
EXPRESSIONS_FORMAT.forEach((item) => {
  MAX_CHAR_LENGTH = Math.max(item.length, MAX_CHAR_LENGTH);
});
var xssFilter2 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var utils_default2 = {
  replace(str) {
    let returnText = str;
    if (returnText) {
      Object.keys(xssFilter2).forEach((key) => {
        returnText = returnText.replaceAll(key, xssFilter2[key]);
      });
    }
    return returnText;
  },
  unReplace(inputText) {
    let returnText = inputText;
    if (returnText) {
      Object.keys(xssFilter2).forEach((key) => {
        returnText = returnText.replaceAll(xssFilter2[key], key);
      });
    }
    return returnText;
  },
  unFieldName(fieldName) {
    if (fieldName) {
      return this.unReplace(fieldName).replaceAll('"', '\\"');
    }
    return "";
  },
  isBlank(value) {
    if (value === null)
      return true;
    if (value === "")
      return true;
    if (typeof value === "undefined")
      return true;
    if (typeof value === "string" && (value === "" || value.replace(/\s/g, "") === ""))
      return true;
    return false;
  },
  isUndefined(value) {
    return typeof value === "undefined";
  },
  isFunction(value) {
    return typeof value === "function";
  },
  isString(value) {
    return typeof value === "string";
  },
  isNumber(value) {
    if (this.isBlank(value)) {
      return false;
    }
    return !isNaN(value);
  },
  isArray(value) {
    return Array.isArray(value);
  },
  getHashCode(str) {
    let hash = 0;
    if (str.length == 0)
      return hash;
    for (let i = 0; i < str.length; i++) {
      let tmpChar = str.charCodeAt(i);
      hash = (hash << 5) - hash + tmpChar;
      hash = hash & hash;
    }
    return hash;
  },
  pad(str, length) {
    str = String(str);
    while (str.length < length) {
      str = "0" + str;
    }
    return str;
  }
};
var format_default = (date, format) => {
  format = format || "YYYY-MM-DD";
  const len = format.length;
  let result = [];
  for (let i = 0; i < len; ) {
    let minLen = Math.min(MAX_CHAR_LENGTH, len - i);
    let j = minLen;
    for (; j > 0; j--) {
      const v = format.substring(i, i + j);
      if (EXPRESSIONS_FORMAT.includes(v)) {
        try {
          result.push(expressionsFunction[v](date));
        } catch (e) {
          console.log(EXPRESSIONS_FORMAT.includes(v), v, e);
        }
        break;
      }
    }
    if (j < 1) {
      result.push(format.substring(i, i + 1));
      i += 1;
    } else {
      i += j;
    }
  }
  return result.join("");
};
var expressionsFunction = {
  YY: (date) => {
    return String(date.getFullYear()).slice(-2);
  },
  YYYY: (date) => {
    return String(date.getFullYear());
  },
  M: (date) => {
    return String(date.getMonth() + 1);
  },
  MM: (date) => {
    return utils_default2.pad(date.getMonth() + 1, 2);
  },
  MMM: (date) => {
    return Lanauage_default2.getMonthsMessage(date.getMonth());
  },
  MMMM: (date) => {
    return Lanauage_default2.getMonthsMessage(date.getMonth(), "full");
  },
  D: (date) => {
    return String(date.getDate());
  },
  DD: (date) => {
    return utils_default2.pad(date.getDate(), 2);
  },
  d: (date) => {
    return String(date.getDate());
  },
  dd: (date) => {
    return utils_default2.pad(date.getDate(), 2);
  },
  ddd: (date) => {
    return Lanauage_default2.getWeeksMessage(date.getDay());
  },
  dddd: (date) => {
    return Lanauage_default2.getWeeksMessage(date.getDay(), "full");
  },
  H: (date) => {
    return String(date.getHours());
  },
  HH: (date) => {
    return utils_default2.pad(date.getHours(), 2);
  },
  h: (date) => {
    return getH(date);
  },
  hh: (date) => {
    return utils_default2.pad(getH(date), 2);
  },
  a: (date) => {
    return String(date.getFullYear()).slice(-2);
  },
  A: (date) => {
    return getMeridiem(date, true, true);
  },
  m: (date) => {
    return String(date.getMinutes());
  },
  mm: (date) => {
    return utils_default2.pad(date.getMinutes(), 2);
  },
  s: (date) => {
    return String(date.getSeconds());
  },
  ss: (date) => {
    return utils_default2.pad(date.getSeconds(), 2);
  },
  SSS: (date) => {
    return utils_default2.pad(date.getMilliseconds(), 3);
  }
};
function getH(date) {
  let hour = date.getHours();
  if (hour > 12) {
    hour -= 12;
  } else if (hour < 1) {
    hour = 12;
  }
  return hour;
}
function getMeridiem(date, isUpper, isShort) {
  const hour = date.getHours();
  let m = hour < 12 ? "am" : "pm";
  m = Lanauage_default2.getMessage(m);
  m = isUpper ? m.toUpperCase() : m;
  return m;
}
var parser_default = (dateStr, format) => {
  if (dateStr.length > 1e3) {
    return null;
  }
  format = format || DEFAULT_DATE_FORMAT;
  const dateInfo = {
    year: (/* @__PURE__ */ new Date()).getFullYear(),
    month: 0,
    day: 1,
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
    isPm: false,
    isH: false,
    charIdx: 0
  };
  const len = format.length;
  let startIdx = 0;
  for (let i = 0; i < len; ) {
    let minLen = Math.min(MAX_CHAR_LENGTH, len - i);
    let j = minLen;
    for (; j > 0; j--) {
      const v = format.substring(i, i + j);
      if (EXPRESSIONS_FORMAT.includes(v)) {
        const expInfo = expressionsFunction2[v];
        const val = matchFind(dateStr.substring(startIdx), expInfo[0]);
        expInfo[1](dateInfo, val);
        startIdx += val.length;
        break;
      }
    }
    if (j < 1) {
      i += 1;
      startIdx += 1;
    } else {
      i += j;
    }
  }
  if (dateInfo.hour != null && !dateInfo.isH) {
    if (dateInfo.isPm && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (!dateInfo.isPm && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }
  }
  let date;
  date = new Date(
    dateInfo.year,
    dateInfo.month,
    dateInfo.day,
    dateInfo.hour,
    dateInfo.minute,
    dateInfo.second,
    dateInfo.millisecond
  );
  return date;
};
var matchFind = (val, regexp2) => {
  const match = regexp2.exec(val);
  return match == null ? "" : match[0];
};
var digitsCheck = {
  twoOptional: /\d\d?/,
  two: /\d\d/,
  three: /\d{3}/,
  four: /\d{4}/
};
var word = /[^\s]+/;
var expressionsFunction2 = {
  YY: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.year = +(("" + (/* @__PURE__ */ new Date()).getFullYear()).substring(0, 2) + val);
    return dateInfo;
  }],
  YYYY: [digitsCheck["four"], (dateInfo, val) => {
    dateInfo.year = +val;
    return dateInfo;
  }],
  M: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.month = +val - 1;
    return dateInfo;
  }],
  MM: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.month = +val - 1;
    return dateInfo;
  }],
  MMM: [word, (dateInfo, val) => {
    dateInfo.month = Lanauage_default2.getMonthsIdx(val, "abbr");
    return dateInfo;
  }],
  MMMM: [word, (dateInfo, val) => {
    dateInfo.month = Lanauage_default2.getMonthsIdx(val, "full");
    return dateInfo;
  }],
  D: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  DD: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  d: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  dd: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.day = +val;
    return dateInfo;
  }],
  ddd: [word, (dateInfo, val) => {
    return dateInfo;
  }],
  dddd: [word, (dateInfo, val) => {
    return dateInfo;
  }],
  H: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.hour = +val;
    dateInfo.isH = true;
    return dateInfo;
  }],
  HH: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.hour = +val;
    dateInfo.isH = true;
    return dateInfo;
  }],
  h: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.hour = +val;
    return dateInfo;
  }],
  hh: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.hour = +val;
    return dateInfo;
  }],
  a: [word, (dateInfo, val) => {
    if (Lanauage_default2.getMessage("am") != val.toLowerCase()) {
      dateInfo.isPm = true;
    }
    return dateInfo;
  }],
  A: [word, (dateInfo, val) => {
    if (Lanauage_default2.getMessage("am") != val.toLowerCase()) {
      dateInfo.isPm = true;
    }
    return dateInfo;
  }],
  m: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.minute = +val;
    return dateInfo;
  }],
  mm: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.minute = +val;
    return dateInfo;
  }],
  s: [digitsCheck["twoOptional"], (dateInfo, val) => {
    dateInfo.second = +val;
    return dateInfo;
  }],
  ss: [digitsCheck["two"], (dateInfo, val) => {
    dateInfo.second = +val;
    return dateInfo;
  }],
  SSS: [digitsCheck["three"], (dateInfo, val) => {
    dateInfo.millisecond = +val;
    return dateInfo;
  }]
};
var DaraDate = class _DaraDate {
  constructor(dt) {
    this.date = dt;
  }
  setYear(num) {
    this.date.setFullYear(num);
    return this;
  }
  addYear(num) {
    this.date.setFullYear(this.date.getFullYear() + num);
    return this;
  }
  addMonth(num) {
    this.date.setMonth(this.date.getMonth() + num);
    return this;
  }
  setMonth(num) {
    this.date.setMonth(num);
    return this;
  }
  setDate(num) {
    this.date.setDate(num);
    return this;
  }
  addDate(num) {
    this.date.setDate(this.date.getDate() + num);
    return this;
  }
  addWeek(num) {
    this.date.setDate(this.date.getDate() + num * 7);
    return this;
  }
  addHours(num) {
    this.date.setHours(this.date.getHours() + num);
    return this;
  }
  setHour(num) {
    this.date.setHours(num);
    return this;
  }
  addMinutes(num) {
    this.date.setMinutes(this.date.getMinutes() + num);
    return this;
  }
  setMinutes(num) {
    this.date.setMinutes(num);
    return this;
  }
  addSeconds(num) {
    this.date.setSeconds(this.date.getSeconds() + num);
    return this;
  }
  addMilliseconds(num) {
    this.date.setMilliseconds(this.date.getMilliseconds() + num);
    return this;
  }
  compare(date) {
    if (this.date.valueOf() < date.valueOf()) {
      return -1;
    } else if (this.date.valueOf() > date.valueOf()) {
      return 1;
    }
    return 0;
  }
  getYear() {
    return this.date.getFullYear();
  }
  getMonth() {
    return this.date.getMonth() + 1;
  }
  getDate() {
    return this.date.getDate();
  }
  getDay() {
    return this.date.getDay();
  }
  getTime() {
    return this.date.getTime();
  }
  format(format) {
    return format_default(this.date, format);
  }
  clone() {
    return new _DaraDate(new Date(this.date.valueOf()));
  }
};
var DEFAULT_OPTIONS = {
  isEmbed: false,
  initialDate: "",
  autoClose: true,
  mode: "date",
  headerOrder: "month,year",
  format: "YYYY-MM-DD",
  zIndex: 1e3,
  minDate: "",
  maxDate: ""
};
function hiddenElement() {
  if (document.getElementById("hiddenDaraDatetimeElement") == null) {
    document.querySelector("body")?.insertAdjacentHTML("beforeend", `<div id="hiddenDaraDatetimeElement" class="dara-datetime-hidden"></div>`);
  }
  return document.getElementById("hiddenDaraDatetimeElement");
}
var daraDatetimeIdx = 0;
var DateTimePicker = class {
  constructor(selector, options, message2) {
    this.isInput = false;
    this.isVisible = false;
    this.minYear = -1;
    this.maxYear = -1;
    this.minMonth = -1;
    this.maxMonth = -1;
    this._documentClickEvent = (e) => {
      if (this.isVisible && (e.target != this.targetElement && !e.composedPath().includes(this.datetimeElement))) {
        this.hide();
      }
    };
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    daraDatetimeIdx += 1;
    let selectorElement;
    if (typeof selector === "string") {
      selectorElement = document.querySelector(selector);
    } else {
      selectorElement = selector;
    }
    if (!selectorElement) {
      throw new Error(`${selector} datetimepicker element not found`);
    }
    this._viewMode = Object.keys(DateViewMode).includes(this.options.mode) ? this.options.mode : "date";
    this.initMode = this._viewMode;
    Lanauage_default2.set(message2);
    this.dateFormat = this.options.format || DEFAULT_DATE_FORMAT;
    let viewDate;
    if (typeof this.options.initialDate) {
      if (typeof this.options.initialDate === "string") {
        viewDate = new DaraDate(parser_default(this.options.initialDate, this.dateFormat) || /* @__PURE__ */ new Date());
      } else {
        viewDate = new DaraDate(this.options.initialDate);
      }
    } else {
      viewDate = new DaraDate(/* @__PURE__ */ new Date());
    }
    this.initialDate = viewDate.format(this.dateFormat);
    this.currentDate = viewDate;
    this.targetElement = selectorElement;
    this.minDate = this._minDate();
    this.maxDate = this._maxDate();
    if (this.options.isEmbed) {
      this.datetimeElement = selectorElement;
      this.datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} embed`;
    } else {
      this.isInput = true;
      this.targetElement.setAttribute("value", this.initialDate);
      const datetimeElement = document.createElement("div");
      datetimeElement.className = `dara-datetime-wrapper ddtp-${daraDatetimeIdx} layer`;
      datetimeElement.setAttribute("style", `z-index:${this.options.zIndex};`);
      hiddenElement()?.appendChild(datetimeElement);
      this.datetimeElement = datetimeElement;
      this.initTargetEvent();
    }
    this.createDatetimeTemplate();
    if (this.isTimeMode()) {
      this.hourInputEle = this.datetimeElement.querySelector(".ddtp-hour");
      this.minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute");
    } else {
      this.hourInputEle = {};
      this.minuteInputEle = {};
    }
    this.changeViewMode(this._viewMode);
    this.initHeaderEvent();
    this.initDateEvent();
    this.initTimeEvent();
  }
  static {
    this.format = format_default;
  }
  static {
    this.parser = parser_default;
  }
  _minDate() {
    let minDate = this.options.minDate;
    if (minDate != "") {
      if (typeof minDate === "string") {
        const dt = parser_default(minDate, this.dateFormat);
        if (!dt) {
          return -1;
        }
        minDate = dt;
      }
      this.minYear = minDate.getFullYear();
      this.minMonth = +(this.minYear + utils_default2.pad(minDate.getMonth(), 2));
      return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate(), 0, 0).getTime();
    }
    return -1;
  }
  _maxDate() {
    let maxDate = this.options.maxDate;
    if (maxDate != "") {
      if (typeof maxDate === "string") {
        const dt = parser_default(maxDate, this.dateFormat);
        if (!dt) {
          return -1;
        }
        maxDate = dt;
      }
      this.maxYear = maxDate.getFullYear();
      this.maxMonth = +(this.maxYear + utils_default2.pad(maxDate.getMonth(), 2));
      return new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate(), 23, 59).getTime();
    }
    return -1;
  }
  set viewMode(mode) {
    if (this._viewMode === mode) {
      return;
    }
    this._viewMode = mode;
    this.changeViewMode(mode);
  }
  get viewMode() {
    return this._viewMode;
  }
  /**
   * 모드  change
   * @param mode 
   */
  changeViewMode(mode) {
    this.datetimeElement.querySelector(".ddtp-datetime")?.setAttribute("view-mode", mode);
    if (mode === "year") {
      this.yearDraw();
    } else if (mode === "month") {
      this.monthDraw();
    } else {
      this.dayDraw();
    }
  }
  initHeaderEvent() {
    this.datetimeElement.querySelector(".ddtp-move-btn.prev")?.addEventListener("click", (e) => {
      this.moveDate("prev");
    });
    this.datetimeElement.querySelector(".ddtp-move-btn.next")?.addEventListener("click", (e) => {
      this.moveDate("next");
    });
    this.datetimeElement.querySelector(".ddtp-header-year")?.addEventListener("click", (e) => {
      this.viewMode = "year";
    });
    this.datetimeElement.querySelector(".ddtp-header-month")?.addEventListener("click", (e) => {
      this.viewMode = "month";
    });
  }
  /**
   * 날짜 달력 이벤트처리.
   */
  initDateEvent() {
    this.datetimeElement.querySelector(".ddtp-day-body")?.addEventListener("click", (e) => {
      const targetEle = e.target;
      if (targetEle.classList.contains("ddtp-day") || targetEle.closest(".ddtp-day")) {
        const selectDate = targetEle.getAttribute("data-day") || "1";
        const mmDD = selectDate.split(",");
        this.currentDate.setMonth(+mmDD[0] - 1);
        this.currentDate.setDate(+mmDD[1]);
        if (this.isDayDisabled(this.currentDate)) {
          return;
        }
        this.datetimeElement.querySelector(".select")?.classList.remove("select");
        targetEle.classList.add("select");
        if (this.isTimeMode()) {
          this.currentDate.setHour(+this.hourInputEle.value);
          this.currentDate.setMinutes(+this.minuteInputEle.value);
        }
        this.dateChangeEvent(e);
      }
    });
  }
  isTimeMode() {
    return this._viewMode === "time" || this._viewMode === "datetime";
  }
  /**
   * 시간 분 설정 이벤트 처리.
   *
   * @public
   */
  initTimeEvent() {
    if (!this.isTimeMode())
      return;
    let hh = this.currentDate.format("HH");
    const hourInputEle = this.datetimeElement.querySelector(".ddtp-hour");
    const hourRangeEle = this.datetimeElement.querySelector(".ddtp-hour-range");
    hourInputEle.value = hh;
    hourRangeEle.value = hh;
    hourInputEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      const addVal = utils_default2.pad(targetElement.value, 2);
      hourInputEle.value = addVal;
      hourRangeEle.value = addVal;
    });
    hourRangeEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      hourInputEle.value = utils_default2.pad(targetElement.value, 2);
    });
    let mm = this.currentDate.format("mm");
    const minuteInputEle = this.datetimeElement.querySelector(".ddtp-minute");
    const minuteRangeEle = this.datetimeElement.querySelector(".ddtp-minute-range");
    minuteInputEle.value = mm;
    minuteRangeEle.value = mm;
    minuteInputEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      const addVal = utils_default2.pad(targetElement.value, 2);
      minuteInputEle.value = addVal;
      minuteRangeEle.value = addVal;
    });
    minuteRangeEle.addEventListener("input", (e) => {
      const targetElement = e.target;
      minuteInputEle.value = utils_default2.pad(targetElement.value, 2);
    });
    this.datetimeElement.querySelector(".time-select")?.addEventListener("click", (e) => {
      this.currentDate.setHour(+hourInputEle.value);
      this.currentDate.setMinutes(+minuteInputEle.value);
      this.dateChangeEvent(e);
    });
    this.datetimeElement.querySelector(".time-today")?.addEventListener("click", (e) => {
      const initDate = new DaraDate(parser_default(this.initialDate, this.dateFormat) || /* @__PURE__ */ new Date());
      this.currentDate.setYear(initDate.getYear());
      this.currentDate.setMonth(initDate.getMonth() - 1);
      this.currentDate.setDate(initDate.getDate());
      this.changeViewMode(this.initMode);
    });
  }
  /**
   * 날짜 이동
   * @param moveMode // 앞뒤 이동 prev, next
   * @returns 
   */
  moveDate(moveMode) {
    if (this._viewMode === "date" || this._viewMode === "datetime") {
      this.currentDate.addMonth("prev" === moveMode ? -1 : 1);
      this.dayDraw();
      return;
    }
    if (this._viewMode === "month") {
      this.currentDate.addYear("prev" === moveMode ? -1 : 1);
      this.monthDraw();
      return;
    }
    if (this._viewMode === "year") {
      this.currentDate.addYear("prev" === moveMode ? -16 : 16);
      this.yearDraw();
    }
  }
  /**
   * get date value
   * 
   * @returns 
   */
  getDateValue() {
    return this.currentDate.format(this.dateFormat);
  }
  /**
   * 옵션 셋팅
   * @static
   * @param {DateTimePickerOptions} options
   */
  static setOptions(options) {
    DEFAULT_OPTIONS = Object.assign({}, DEFAULT_OPTIONS, options);
  }
  /**
   * 달력 보이기 처리. 
   * 
   * @returns 
   */
  show() {
    if (this.isVisible) {
      return;
    }
    this.isVisible = true;
    const docSize = getDocSize();
    this.datetimeElement.classList.remove("hide");
    this.datetimeElement.classList.add("show");
    const rect = this.targetElement.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft;
    const offsetTop = rect.top + scrollTop;
    let top = offsetTop + this.targetElement.offsetHeight + 2;
    const left = rect.left + scrollLeft;
    if (top + this.datetimeElement.offsetHeight > docSize.clientHeight) {
      const newTop = offsetTop - (this.datetimeElement.offsetHeight + 2);
      top = newTop > 0 ? newTop : top;
    }
    this.datetimeElement.setAttribute("style", `top:${top}px;left:${left}px;z-index:${this.options.zIndex}`);
    document.addEventListener("click", this._documentClickEvent);
  }
  /**
   * 달력 숨기기
   */
  hide() {
    this.isVisible = false;
    this.datetimeElement.classList.remove("show");
    this.datetimeElement.classList.add("hide");
    document.removeEventListener("click", this._documentClickEvent);
  }
  /**
   * 타켓 이벤트 처리.
   */
  initTargetEvent() {
    if (this.targetElement) {
      this.targetElement.addEventListener("click", (e) => {
        this.show();
      });
    }
  }
  dateChangeEvent(e) {
    const formatValue = this.currentDate.format(this.dateFormat);
    if (this.options.onChange) {
      if (this.options.onChange(formatValue, e) === false) {
        return;
      }
      ;
    }
    if (this.isInput) {
      this.targetElement.setAttribute("value", formatValue);
    }
    if (!this.options.isEmbed && this.options.autoClose) {
      this.hide();
    }
  }
  /**
   *  datepicker template  그리기
   */
  createDatetimeTemplate() {
    const headerOrder = this.options.headerOrder.split(",");
    let datetimeTemplate = `<div class="ddtp-datetime" view-mode="${this._viewMode}">
			<div class="ddtp-header">
                <span class="${headerOrder[0] === "year" ? "ddtp-header-year" : "ddtp-header-month"}"></span>
                <span class="${headerOrder[0] === "year" ? "ddtp-header-month" : "ddtp-header-year"}"></span>

                <span class="ddtp-date-move">  
                    <a href="javascript:;" class="ddtp-move-btn prev">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
                    </a>
                    <a href="javascript:;" class="ddtp-move-btn next">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none"/><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
                    </a> 
                </span>
			</div>
            <div class="ddtp-body">
                <table class="ddtp-days">
                    <thead class="ddtp-day-header">
                        <tr>		
                            <td class="ddtp-day-label sun red">${Lanauage_default2.getWeeksMessage(0)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default2.getWeeksMessage(1)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default2.getWeeksMessage(2)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default2.getWeeksMessage(3)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default2.getWeeksMessage(4)}</td>		
                            <td class="ddtp-day-label">${Lanauage_default2.getWeeksMessage(5)}</td>		
                            <td class="ddtp-day-label sat">${Lanauage_default2.getWeeksMessage(6)}</td>		
                        </tr>
                    </thead>
                    <tbody class="ddtp-day-body">
                    </tbody>
                    
                    <tfoot class="ddtp-day-footer">
                        <td colspan="7"><div class="footer-tooltip"></div></td>
                    </tfoot>
                </table>

                <div class="ddtp-times">
                        <div class="time-container">
                            <div class="ddtp-time">
                                <span>H: </span><input type="number" class="ddtp-hour" min="0" max="23">
                                <input type="range" min="0" max="23" class="ddtp-hour-range">
                            </div>
                            <div class="ddtp-time">
                                <span>M: </span><input type="number" class="ddtp-minute" min="0" max="59">
                                <input type="range" min="0" max="59" class="ddtp-minute-range">
                            </div>
                        </div>
                        <div class="time-btn">
                            <button type="button" class="time-select">${Lanauage_default2.getMessage("ok")}</button>
                            <button type="button" class="time-today">${Lanauage_default2.getMessage("today")}</button>
                        </div>
                </div>

                <div class="ddtp-months">
                </div>

                <div class="ddtp-years">
                </div>
            </div>
        </div>`;
    this.datetimeElement.innerHTML = datetimeTemplate;
  }
  /**
   * 년 달력 그리기
   */
  yearDraw() {
    const currentYear = this.currentDate.format("YYYY");
    const startYear = +currentYear - 8;
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = `${startYear} ~ ${startYear + 15}`;
    const calHTML = [];
    for (let i = 0; i < 16; i++) {
      const year = startYear + i;
      const disabled = this.isYearDisabled(year);
      calHTML.push(`<div class="ddtp-year ${disabled ? "disabled" : ""}" data-year="${year}">${year}</div>`);
    }
    this.datetimeElement.querySelector(".ddtp-years").innerHTML = calHTML.join("");
    this.datetimeElement.querySelectorAll(".ddtp-year")?.forEach((yearEle) => {
      yearEle.addEventListener("click", (e) => {
        const targetEle = e.target;
        if (targetEle) {
          const year = targetEle.getAttribute("data-year");
          if (year) {
            const numYear = +year;
            if (this.initMode == "year") {
              if (this.isYearDisabled(numYear)) {
                return;
              }
              this.currentDate.setYear(numYear);
              this.dateChangeEvent(e);
              return;
            }
            this.currentDate.setYear(numYear);
            this.viewMode = "month";
          }
        }
      });
    });
  }
  /**
   * 월 달력 그리기
   */
  monthDraw() {
    const year = this.currentDate.format("YYYY");
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = year;
    const monthElements = this.datetimeElement.querySelectorAll(".ddtp-months > .ddtp-month");
    if (monthElements.length > 0) {
      if (this.isYearDisabled(+year)) {
        monthElements.forEach((monthEle) => {
          if (!monthEle.classList.contains("disabled")) {
            monthEle.classList.add("disabled");
          }
        });
        return;
      }
      monthElements.forEach((monthEle, idx) => {
        if (this.isMonthDisabled(+year, idx)) {
          if (!monthEle.classList.contains("disabled")) {
            monthEle.classList.add("disabled");
          }
        } else {
          monthEle.classList.remove("disabled");
        }
      });
      return;
    }
    this.datetimeElement.querySelector(".ddtp-header-month").textContent = this.currentDate.format("MMMM");
    const calHTML = [];
    for (let i = 0; i < 12; i++) {
      const disabled = this.isMonthDisabled(+year, i);
      calHTML.push(`<div class="ddtp-month ${disabled ? "disabled" : ""}" data-month="${i}">${Lanauage_default2.getMonthsMessage(i, "abbr")}</div>`);
    }
    this.datetimeElement.querySelector(".ddtp-months").innerHTML = calHTML.join("");
    this.datetimeElement.querySelectorAll(".ddtp-month")?.forEach((monthEle) => {
      monthEle.addEventListener("click", (e) => {
        const targetEle = e.target;
        if (targetEle) {
          const month = targetEle.getAttribute("data-month");
          if (month) {
            if (this.initMode == "month") {
              if (this.isMonthDisabled(this.currentDate.getYear(), +month)) {
                return;
              }
              this.currentDate.setMonth(+month);
              this.dateChangeEvent(e);
              return;
            }
            this.currentDate.setMonth(+month);
            this.viewMode = this.initMode;
            this.dayDraw();
          }
        }
      });
    });
  }
  /**
   * 날짜 그리기
   */
  dayDraw() {
    const dateFormat = this.dateFormat;
    let monthFirstDate = new DaraDate(parser_default(this.currentDate.format("YYYY-MM-01"), "YYYY-MM-DD") || /* @__PURE__ */ new Date());
    this.datetimeElement.querySelector(".ddtp-header-year").textContent = monthFirstDate.format("YYYY");
    this.datetimeElement.querySelector(".ddtp-header-month").textContent = monthFirstDate.format("MMMM");
    let day = monthFirstDate.getDay();
    if (day != 0) {
      monthFirstDate.addDate(-day);
    }
    const calHTML = [];
    for (let i = 0; i < 42; i++) {
      let dateItem;
      if (i == 0) {
        dateItem = monthFirstDate;
      } else {
        dateItem = monthFirstDate.clone().addDate(i);
      }
      const tooltipDt = dateItem.format(dateFormat);
      if (i % 7 == 0) {
        calHTML.push((i == 0 ? "" : "</tr>") + "<tr>");
      }
      let disabled = this.isDayDisabled(dateItem);
      calHTML.push(`<td class="ddtp-day ${i % 7 == 0 ? "red" : ""} ${this.initialDate == tooltipDt ? "today" : ""} ${disabled ? "disabled" : ""}" data-day="${dateItem.format("M,D")}">`);
      calHTML.push(`${dateItem.format("d")}`);
      calHTML.push("</td>");
    }
    calHTML.push("</tr>");
    this.datetimeElement.querySelector(".ddtp-day-body").innerHTML = calHTML.join("");
  }
  isDayDisabled(dateItem) {
    if (this.minDate != -1 && this.minDate > dateItem.getTime() || this.maxDate != -1 && this.maxDate < dateItem.getTime()) {
      return true;
    }
    return false;
  }
  isYearDisabled(year) {
    if (this.minYear != -1 && this.minYear > year || this.maxYear != -1 && this.maxYear < year) {
      return true;
    }
    return false;
  }
  isMonthDisabled(year, month) {
    if (this.isYearDisabled(year)) {
      return true;
    }
    let yearMonth = +(year + utils_default2.pad(month, 2));
    if (this.minMonth != -1 && this.minMonth > yearMonth || this.maxMonth != -1 && this.maxMonth < yearMonth) {
      return true;
    }
    return false;
  }
  static setMessage(message2) {
    Lanauage_default2.setDefaultMessage(message2);
  }
};
function getDocSize() {
  return {
    clientHeight: Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    ),
    clientWidth: Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
  };
}
var DaraDateTimePicker = DateTimePicker;

// src/renderer/DateRender.ts
var DateRender = class extends Render {
  constructor(field, rowElement, daraForm) {
    super(daraForm, field, rowElement);
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`);
    this.initEvent();
    this.setDefaultInfo();
  }
  initEvent() {
    let dateOnChangeEvent;
    if (typeof this.field.customOptions.onChange !== "undefined") {
      dateOnChangeEvent = typeof this.field.customOptions.onChange;
    }
    this.field.customOptions.onChange = (dt, e) => {
      if (dateOnChangeEvent) {
        dateOnChangeEvent.call(null, dt, e);
      }
      this.setValue(dt);
      this.changeEventCall(this.field, e, this);
    };
    this.dateObj = new DaraDateTimePicker(this.element, this.field.customOptions, {});
  }
  static template(field) {
    const desc = field.description ? `<div>${field.description}</div>` : "";
    return `
    <div class="df-field">
      <input type="text" name="${field.name}" class="form-field text help-icon" />
     </div>
     ${desc}
     <div class="help-message"></div>
     `;
  }
  getValue() {
    return this.element.value;
  }
  setValue(value) {
    this.field.$value = value;
    this.element.value = value;
  }
  reset() {
    this.setValue("");
    this.setDisabled(false);
    resetRowElementStyleClass(this.rowElement);
  }
  getElement() {
    return this.element;
  }
  valid() {
    const validResult = stringValidator(this.getValue(), this.field);
    invalidMessage(this.field, this.rowElement, validResult);
    return validResult;
  }
};

// src/constants.ts
var RULES = {
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
  VALIDATOR: "validator"
};
var FIELD_PREFIX = "dff";
var RENDER_TEMPLATE = {
  "number": NumberRender,
  "textarea": TextAreaRender,
  "dropdown": DropdownRender,
  "checkbox": CheckboxRender,
  "radio": RadioRender,
  "text": TextRender,
  "password": PasswordRender,
  "file": FileRender,
  "custom": CustomRender,
  "group": GroupRender,
  "hidden": HiddenRender,
  "button": ButtonRender,
  "range": RangeRender,
  "date": DateRender
};
var TEXT_ALIGN = {
  left: "left",
  center: "center",
  right: "right"
};

// src/util/Lanauage.ts
var localeMessage2 = {
  required: "{label} \uD544\uC218 \uC785\uB825\uC0AC\uD56D\uC785\uB2C8\uB2E4.",
  fileButton: "\uD30C\uC77C\uCC3E\uAE30",
  string: {
    minLength: "{minLength} \uAE00\uC790 \uC774\uC0C1\uC73C\uB85C \uC785\uB825\uD558\uC138\uC694.",
    maxLength: "{maxLength} \uAE00\uC790 \uC774\uD558\uB85C \uC785\uB825\uD558\uC138\uC694.",
    between: "{minLength} ~ {maxLength} \uC0AC\uC774\uC758 \uAE00\uC790\uB97C \uC785\uB825\uD558\uC138\uC694."
  },
  number: {
    nan: "\uC22B\uC790\uB9CC \uC785\uB825 \uAC00\uB2A5 \uD569\uB2C8\uB2E4.",
    minimum: "{minimum} \uAC12\uACFC \uAC19\uAC70\uB098 \uCEE4\uC57C \uD569\uB2C8\uB2E4",
    exclusiveMinimum: "{minimum} \uBCF4\uB2E4 \uCEE4\uC57C \uD569\uB2C8\uB2E4",
    maximum: "{maximum} \uAC12\uACFC \uAC19\uAC70\uB098 \uC791\uC544\uC57C \uD569\uB2C8\uB2E4",
    exclusiveMaximum: "{maximum} \uBCF4\uB2E4 \uC791\uC544\uC57C \uD569\uB2C8\uB2E4.",
    between: "{minimum}~{maximum} \uC0AC\uC774\uC758 \uAC12\uC744 \uC785\uB825\uD558\uC138\uC694.",
    betweenExclusiveMin: "{minimum} \uBCF4\uB2E4 \uD06C\uACE0 {maximum} \uBCF4\uB2E4 \uAC19\uAC70\uB098 \uC791\uC544\uC57C \uD569\uB2C8\uB2E4",
    betweenExclusiveMax: "{minimum} \uBCF4\uB2E4 \uAC19\uAC70\uB098 \uD06C\uACE0 {maximum} \uBCF4\uB2E4 \uC791\uC544\uC57C \uD569\uB2C8\uB2E4",
    betweenExclusiveMinMax: "{minimum} \uBCF4\uB2E4 \uD06C\uACE0 {maximum} \uBCF4\uB2E4 \uC791\uC544\uC57C \uD569\uB2C8\uB2E4"
  },
  regexp: {
    "mobile": "\uD578\uB4DC\uD3F0 \uBC88\uD638\uAC00 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    "email": "\uC774\uBA54\uC77C\uC774 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    "url": "URL\uC774 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    "alpha": "\uC601\uBB38\uB9CC \uC785\uB825 \uAC00\uB2A5 \uD569\uB2C8\uB2E4.",
    "alpha-num": "\uC601\uBB38\uACFC \uC22B\uC790\uB9CC \uC785\uB825 \uAC00\uB2A5 \uD569\uB2C8\uB2E4.",
    "number": "\uC22B\uC790\uB9CC \uC785\uB825 \uAC00\uB2A5 \uD569\uB2C8\uB2E4.",
    "variable": "\uAC12\uC774 \uC720\uD6A8\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
    "number-char": "\uC22B\uC790, \uBB38\uC790 \uAC01\uAC01 \uD558\uB098 \uC774\uC0C1 \uD3EC\uD568 \uB418\uC5B4\uC57C \uD569\uB2C8\uB2E4.",
    "upper-char": "\uB300\uBB38\uC790\uAC00 \uD558\uB098 \uC774\uC0C1 \uD3EC\uD568 \uB418\uC5B4\uC57C \uD569\uB2C8\uB2E4.",
    "upper-char-special": "\uB300\uBB38\uC790,\uC18C\uBB38\uC790,\uD2B9\uC218\uBB38\uC790 \uAC01\uAC01 \uD558\uB098 \uC774\uC0C1 \uD3EC\uD568 \uB418\uC5B4\uC57C \uD569\uB2C8\uB2E4.",
    "upper-char-special-number": "\uB300\uBB38\uC790,\uC18C\uBB38\uC790,\uD2B9\uC218\uBB38\uC790,\uC22B\uC790 \uAC01\uAC01 \uD558\uB098 \uC774\uC0C1 \uD3EC\uD568 \uB418\uC5B4\uC57C\uD569\uB2C8\uB2E4."
  }
};
var Language2 = class {
  constructor() {
    this.lang = localeMessage2;
  }
  /**
   * 다국어 메시지 등록
   *
   * @public
   * @param {?Message} [lang] 둥록할 메시지
   */
  set(lang) {
    this.lang = Object.assign({}, localeMessage2, lang);
  }
  /**
   * 메시지 얻기
   *
   * @public
   * @param {string} messageKey 메시지 키
   * @returns {*}
   */
  getMessage(messageKey) {
    return this.lang[messageKey];
  }
  /**
   * ValidResult 값을 메시지로 변경.
   *
   * @public
   * @param {FormField} field
   * @param {ValidResult} validResult
   * @returns {string[]}
   */
  validMessage(field, validResult) {
    let messageFormat = "";
    let messageFormats = [];
    if (validResult.regexp) {
      messageFormat = this.lang.regexp[validResult.regexp];
      messageFormats.push(messageFormat);
    }
    validResult.constraint.forEach((constraint) => {
      if (constraint === RULES.REQUIRED) {
        messageFormat = message(this.lang.required, field);
        messageFormats.push(messageFormat);
      }
      if (field.type == "number" || field.renderType == "number" || field.renderType == "range") {
        messageFormat = this.lang.number[constraint];
        messageFormats.push(messageFormat);
      } else {
        messageFormat = this.lang.string[constraint];
        messageFormats.push(messageFormat);
      }
    });
    const reMessage = [];
    const msgParam = Object.assign({}, { name: field.name, label: field.label }, field.rule);
    messageFormats.forEach((msgFormat) => {
      if (msgFormat) {
        reMessage.push(message(msgFormat, msgParam));
      }
    });
    if (validResult.validator) {
      reMessage.push(validResult.validator.message);
    }
    return reMessage;
  }
};
function message(msgFormat, msgParam) {
  return msgFormat.replace(/\{{1,1}([A-Za-z0-9_.]*)\}{1,1}/g, (match, key) => {
    return typeof msgParam[key] !== "undefined" ? msgParam[key] : match;
  });
}
var Lanauage_default = new Language2();

// src/util/renderFactory.ts
var getRenderer = (field) => {
  let renderType = field.renderType || "text";
  if (field.children) {
    return RENDER_TEMPLATE["group"];
  }
  let render = RENDER_TEMPLATE[renderType];
  return render ? render : RENDER_TEMPLATE["text"];
};

// src/FieldInfoMap.ts
var FieldInfoMap = class {
  constructor(selector) {
    this.fieldIdx = 0;
    this.allFieldInfo = {};
    this.keyNameMap = {};
    this.conditionFields = [];
    this.fieldPrefix = `${FIELD_PREFIX}-${utils_default.getHashCode(selector)}`;
  }
  /**
   * add Field 정보
   *
   * @public
   * @param {FormField} field 폼필드 정보
   */
  addField(field) {
    this.fieldIdx += 1;
    field.$key = `${this.fieldPrefix}-${this.fieldIdx}`;
    this.keyNameMap[field.name] = field.$key;
    this.allFieldInfo[field.$key] = field;
    field.$renderer = getRenderer(field);
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
  getFieldName(fieldName) {
    return this.allFieldInfo[this.keyNameMap[fieldName]];
  }
  /**
   * 필드 키로 정보 구하기 
   *
   * @public
   * @param {string} fieldKey
   * @returns {FormField}
   */
  get(fieldKey) {
    return this.allFieldInfo[fieldKey];
  }
  /**
   * 필드명 있는지 여부 체크. 
   *
   * @public
   * @param {string} fieldName 필드명
   * @returns {boolean}
   */
  hasFieldName(fieldName) {
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
  getAllFieldInfo() {
    return this.allFieldInfo;
  }
  /**
   * 필드 정보 맵에서 지우기
   *
   * @public
   * @param {string} fieldName
   */
  removeFieldInfo(fieldName) {
    delete this.allFieldInfo[this.keyNameMap[fieldName]];
  }
  /**
   * 모든 필드값 구하기
   *
   * @public
   * @param {boolean} isValid
   * @returns {*}
   */
  getAllFieldValue(formValue, isValid) {
    if (isValid !== true) {
      for (let [key, filedInfo] of Object.entries(this.allFieldInfo)) {
        formValue[filedInfo.name] = filedInfo.$renderer.getValue();
      }
      return formValue;
    }
    return new Promise((resolve, reject) => {
      for (let [key, filedInfo] of Object.entries(this.allFieldInfo)) {
        if (!this.isValueFieldCheck(filedInfo)) {
          continue;
        }
        const renderInfo = filedInfo.$renderer;
        let fieldValid = renderInfo.valid();
        if (fieldValid !== true) {
          renderInfo.focus();
          fieldValid = fieldValid;
          fieldValid.message = Lanauage_default.validMessage(filedInfo, fieldValid)[0];
          reject(new Error(fieldValid.message, { cause: fieldValid }));
          return;
        }
        formValue[filedInfo.name] = renderInfo.getValue();
      }
      resolve(formValue);
    });
  }
  getFormDataValue(formValue, isValid) {
    if (isValid !== true) {
      let reval = new FormData();
      for (let [key, value] of Object.entries(formValue)) {
        reval.set(key, value);
      }
      for (let [key, filedInfo] of Object.entries(this.allFieldInfo)) {
        addFieldFormData(reval, filedInfo, filedInfo.$renderer.getValue());
      }
      return reval;
    }
    return new Promise((resolve, reject) => {
      let reval = new FormData();
      for (let [key, value] of Object.entries(formValue)) {
        reval.set(key, value);
      }
      for (let [key, fieldInfo] of Object.entries(this.allFieldInfo)) {
        if (!this.isValueFieldCheck(fieldInfo)) {
          continue;
        }
        const renderInfo = fieldInfo.$renderer;
        let fieldValid = renderInfo.valid();
        if (fieldValid !== true) {
          renderInfo.focus();
          fieldValid = fieldValid;
          fieldValid.message = Lanauage_default.validMessage(fieldInfo, fieldValid)[0];
          reject(new Error(fieldValid.message, { cause: fieldValid }));
          return;
        }
        addFieldFormData(reval, fieldInfo, renderInfo.getValue());
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
  isValueFieldCheck(field) {
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
  isConditionField(field) {
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
          if (field.conditional.eq == condField.$renderer.getValue()) {
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
  conditionCheck() {
    this.conditionFields.forEach((fieldKey) => {
      const filedInfo = this.allFieldInfo[fieldKey];
      let condFlag = this.isConditionField(filedInfo);
      if (condFlag) {
        filedInfo.$renderer.show();
      } else {
        filedInfo.$renderer.hide();
      }
    });
  }
};
function addFieldFormData(formData, fieldInfo, fieldValue) {
  if (fieldInfo.renderType === "file") {
    const uploadFiles = fieldValue["uploadFile"];
    for (let uploadFile of uploadFiles) {
      formData.append(fieldInfo.name, uploadFile);
    }
    formData.set(fieldInfo.name + "RemoveIds", fieldValue["removeIds"]);
  } else {
    formData.set(fieldInfo.name, fieldValue);
  }
}

// src/DaraForm.ts
var defaultOptions = {
  mode: "horizontal",
  // horizontal , vertical // 가로 세로 모드
  width: "100%",
  labelStyle: {
    width: "20%",
    align: TEXT_ALIGN.left
  },
  notValidMessage: "This form is not valid.",
  fields: []
};
var daraFormIdx = 0;
var DaraForm = class {
  constructor(selector, options, message2) {
    this.formValue = {};
    this.addRowFields = [];
    /**
     * 폼 데이터 reset
     */
    this.resetForm = () => {
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
    this.resetField = (fieldName) => {
      this.fieldInfoMap.getFieldName(fieldName).$renderer.reset();
      this.formValue[fieldName] = "";
      this.conditionCheck();
    };
    /**
     * field 값 얻기
     *
     * @param fieldName  필드명
     * @returns
     */
    this.getFieldValue = (fieldName) => {
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
    this.getValue = (isValid) => {
      return this.fieldInfoMap.getAllFieldValue(this.formValue, isValid);
    };
    this.getFormDataValue = (isValid) => {
      return this.fieldInfoMap.getFormDataValue(this.formValue, isValid);
    };
    /**
     * 폼 필드 value 셋팅
     * @param values
     */
    this.setValue = (values) => {
      Object.keys(values).forEach((fieldName) => {
        this._setFieldValue(fieldName, values[fieldName]);
      });
      this.conditionCheck();
    };
    this.setFieldValue = (fieldName, value) => {
      this._setFieldValue(fieldName, value);
      this.conditionCheck();
    };
    this.setFieldItems = (fieldName, values) => {
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
    this.addField = (field) => {
      this.options.fields.push(field);
      this.addRow(field);
      this.conditionCheck();
    };
    /**
     * field 제거
     *
     * @param {string} fieldName
     */
    this.removeField = (fieldName) => {
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
    this.isValidForm = () => {
      const result = this.validForm();
      return result.length > 0;
    };
    /**
     * 유효성 검증 폼 검증여부 리턴
     *
     * @returns {any[]}
     */
    this.validForm = () => {
      let validResult = [];
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
    this.isValidField = (fieldName) => {
      const filedInfo = this.fieldInfoMap.getFieldName(fieldName);
      if (utils_default.isUndefined(filedInfo)) {
        throw new Error(`Field name [${fieldName}] not found`);
      }
      const renderInfo = filedInfo.$renderer;
      if (renderInfo) {
        return renderInfo.valid() === true;
      }
      return true;
    };
    this.getOptions = () => {
      return this.options;
    };
    this.options = Object.assign({}, defaultOptions, options);
    daraFormIdx += 1;
    Lanauage_default.set(message2);
    this.fieldInfoMap = new FieldInfoMap(selector);
    this.isHorizontal = this.options.mode === "horizontal";
    const formElement = document.querySelector(selector);
    if (formElement) {
      formElement.className = `dara-form df-${daraFormIdx} ${this.isHorizontal ? "horizontal" : "vertical"}`;
      formElement.setAttribute("style", `width:${this.options.width};`);
      this.formElement = formElement;
      this.createForm(this.options.fields);
    } else {
      throw new Error(`${selector} form selector not found`);
    }
  }
  static setMessage(message2) {
    Lanauage_default.set(message2);
  }
  createForm(fields) {
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
  addRow(field) {
    if (this.checkHiddenField(field)) {
      return;
    }
    this.addRowFields = [];
    const rowElement = document.createElement("div");
    rowElement.className = `df-row`;
    let rednerTemplate = this.rowTemplate(field);
    rowElement.setAttribute("id", field.$key);
    rowElement.innerHTML = rednerTemplate;
    this.formElement.appendChild(rowElement);
    this.addRowFields.forEach((fieldSeq) => {
      const fileldInfo = this.fieldInfoMap.get(fieldSeq);
      fileldInfo.$xssName = utils_default.unFieldName(fileldInfo.name);
      const fieldRowElement = this.formElement.querySelector(`#${fileldInfo.$key}`);
      fileldInfo.$renderer = new fileldInfo.$renderer(fileldInfo, fieldRowElement, this);
      fieldRowElement?.removeAttribute("id");
    });
  }
  rowTemplate(field) {
    let fieldHtml = "";
    if (field.children) {
      this.addRowFieldInfo(field);
      fieldHtml = this.groupTemplate(field);
    } else {
      fieldHtml = this.getFieldTempate(field);
    }
    if (this.checkHiddenField(field)) {
      return "";
    }
    let widthStyle = "";
    if (this.isHorizontal) {
      widthStyle = `width:${field.labelStyle?.width ? field.labelStyle.width : this.options.labelStyle.width};`;
    }
    let labelAlignStyleClass = this.getTextAlignStyle(field, null);
    return `
            <div class="df-label ${labelAlignStyleClass} " style="${widthStyle}">
                ${field.labelStyle?.hide ? "" : `<span>${this.getLabelTemplate(field)}</span>`}
            </div>
            <div class="df-field-container ${field.required ? "required" : ""}">
                ${fieldHtml}
            </div>
        `;
  }
  getLabelTemplate(field) {
    const requiredTemplate = field.required ? `<span class="required"></span>` : "";
    const tooltipTemplate = utils_default.isBlank(field.tooltip) ? "" : `<span class="df-tooltip">?<span class="tooltip">${field.tooltip}</span></span>`;
    return `${field.label || ""} ${tooltipTemplate} ${requiredTemplate}`;
  }
  /**
   * 그룹 템플릿
   *
   * @param {FormField} field
   * @returns {*}
   */
  groupTemplate(field) {
    const childTemplae = [];
    let viewStyleClass = "";
    let childLabelWidth = "";
    let isHorizontal = false;
    if (field.viewMode === "vertical") {
      viewStyleClass = "vertical";
    } else {
      if (field.viewMode === "horizontal-row") {
        childLabelWidth = field.childLabelWidth ? `width:${field.childLabelWidth};` : "";
        viewStyleClass = "horizontal-row";
      } else {
        isHorizontal = true;
        viewStyleClass = "horizontal";
      }
    }
    childTemplae.push(`<div class="sub-field-group ${viewStyleClass}">`);
    for (const childField of field.children) {
      childField.$parent = field;
      let childTempate = "";
      if (childField.children) {
        childTempate = this.groupTemplate(childField);
      } else {
        if (this.checkHiddenField(childField)) {
          continue;
        }
        childTempate = this.getFieldTempate(childField);
      }
      if (isHorizontal) {
        childLabelWidth = childField.labelStyle?.width ? `width:${childField.labelStyle?.width};` : "";
      }
      let labelAlignStyleClass = this.getTextAlignStyle(childField, field);
      let labelHideFlag = childField.labelStyle?.hide;
      labelHideFlag = labelHideFlag ? labelHideFlag : utils_default.isUndefined(childField.label) ? true : false;
      childTemplae.push(`<div class="sub-row" id="${childField.$key}">
          <span class="sub-label ${labelAlignStyleClass}" style="${childLabelWidth}">${labelHideFlag ? "" : this.getLabelTemplate(childField)}</span>
          <span class="df-field-container ${childField.required ? "required" : ""}">${childTempate}</span>
      </div>`);
    }
    childTemplae.push("</div>");
    return childTemplae.join("");
  }
  /**
   * text aling style
   *
   * @param {FormField} filed
   * @param {(FormField | null)} parentField
   * @returns {string} style class
   */
  getTextAlignStyle(filed, parentField) {
    let labelAlign = filed.labelStyle?.align ? filed.labelStyle.align : parentField?.labelStyle?.align || this.options.labelStyle.align;
    let labelAlignStyleClass;
    if (Object.keys(TEXT_ALIGN).includes(labelAlign)) {
      labelAlignStyleClass = TEXT_ALIGN[labelAlign];
    } else {
      labelAlignStyleClass = TEXT_ALIGN.left;
    }
    return `txt-${labelAlignStyleClass}`;
  }
  /**
   * field tempalte 구하기
   *
   * @param {FormField} field
   * @returns {string}
   */
  getFieldTempate(field) {
    if (!utils_default.isBlank(field.name) && this.fieldInfoMap.hasFieldName(field.name)) {
      throw new Error(`Duplicate field name "${field.name}"`);
    }
    this.addRowFieldInfo(field);
    return field.$renderer.template(field);
  }
  checkHiddenField(field) {
    const isHidden = utils_default.isHiddenField(field);
    if (isHidden) {
      this.fieldInfoMap.addField(field);
      field.$renderer = new field.$renderer(field, null, this);
      return true;
    }
    return false;
  }
  /**
   * add row file map
   *
   * @param {FormField} field
   */
  addRowFieldInfo(field) {
    utils_default.replaceXssField(field);
    this.fieldInfoMap.addField(field);
    this.addRowFields.push(field.$key);
  }
  /**
   * 필드 element 얻기
   *
   * @param {string} fieldName
   * @returns {*}
   */
  getFieldElement(fieldName) {
    const field = this.fieldInfoMap.getFieldName(fieldName);
    if (field?.$renderer) {
      return field.$renderer.getElement();
    }
    return null;
  }
  getField(fieldName) {
    return this.fieldInfoMap.getFieldName(fieldName);
  }
  _setFieldValue(fieldName, value) {
    this.formValue[fieldName] = value;
    const filedInfo = this.fieldInfoMap.getFieldName(fieldName);
    if (filedInfo) {
      filedInfo.$renderer.setValue(value);
    }
  }
  conditionCheck() {
    this.fieldInfoMap.conditionCheck();
  }
  setFieldDisabled(fieldName, flag) {
    const filedInfo = this.fieldInfoMap.getFieldName(fieldName);
    filedInfo.$renderer.setDisabled(flag);
  }
  static {
    /*
      destroy = () => {
          return this.options;
      }
      */
    this.validator = {
      string: (value, field) => {
        return stringValidator(value, field);
      },
      number: (value, field) => {
        return numberValidator(value, field);
      },
      regexp: (value, field) => {
        let result = { name: field.name, constraint: [] };
        return regexpValidator(value, field, result);
      }
    };
  }
};

// src/index.ts
module.exports = DaraForm;
//# sourceMappingURL=index.cjs.map
