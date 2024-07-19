import { FormOptions } from "@t/FormOptions";
import { FieldStyle, FormField } from "@t/FormField";
import utils from "./util/utils";
import FieldInfoMap from "src/FieldInfoMap";

import styleUtils from "./util/styleUtils";
import DaraForm from "./DaraForm";
import TabRender from "./renderer/TabRender";
import GridRender from "./renderer/GridRender";

/**
 * form template
 *
 * @class FormTemplate
 * @typedef {FormTemplate}
 */
export default class FormTemplate {
  private readonly options: FormOptions;
  private readonly formElement;

  private fieldInfoMap;

  private daraform: DaraForm;

  private addRowFields: string[] = [];

  constructor(daraform: DaraForm, formElement: Element, fieldInfoMap: FieldInfoMap) {
    this.daraform = daraform;
    this.options = daraform.getOptions();
    this.formElement = formElement;

    this.fieldInfoMap = fieldInfoMap;
  }

  /**
   * field row 추가.
   *
   * @param field
   */
  public addRow(field: FormField) {
    if (this.checkHiddenField(field)) {
      return;
    }

    this.addRowFields = [];

    let template = this.rowTemplate(field);

    this.formElement.insertAdjacentHTML("beforeend", template); // Append the element

    this.addRowFields.forEach((fieldSeq) => {
      const fileldInfo = this.fieldInfoMap.get(fieldSeq);

      console.log(fileldInfo, fileldInfo.$key);
      let fieldKey = fileldInfo.$key;

      const fieldWrapperElement = this.formElement.querySelector(`#${fieldKey}`);

      fileldInfo.$renderer = new (fileldInfo.$renderer as any)(fileldInfo, fieldWrapperElement, this.daraform);
      fieldWrapperElement?.removeAttribute("id");
    });
  }

  /**
   * 그룹 템플릿
   *
   * @param {FormField} field
   * @returns {string} row template
   */
  public rowTemplate(field: FormField): string {
    let labelHideFlag = this.isLabelHide(field);

    let fieldStyle: FieldStyle = styleUtils.fieldStyle(this.options, field, null, labelHideFlag);

    let fieldTemplate = this.getTemplate(field, fieldStyle);

    return `
        <div class="df-row form-group ${fieldStyle.fieldClass}" id="${field.$key}">
          ${labelHideFlag ? "" : `<div class="df-label ${fieldStyle.labelClass} ${fieldStyle.labelAlignClass}" title="${field.label ?? ""}" style="${fieldStyle.labelStyle}">${this.getLabelTemplate(field)}</div>`}

          <div class="df-field-container ${fieldStyle.valueClass} ${field.required ? "required" : ""}" style="${fieldStyle.valueStyle}">
              ${fieldTemplate}
          </div>
        </div>
    `;
  }

  /**
   * template 얻기
   *
   * @param {FormField} field
   * @param {FieldStyle} fieldStyle
   * @returns {string}
   */
  private getTemplate(field: FormField, fieldStyle: FieldStyle): string {
    let fieldTemplate = "";

    if (utils.isTabType(field)) {
      fieldTemplate = this.tabTemplate(field);
    } else if (utils.isGridType(field)) {
      fieldTemplate = this.gridTemplate(field);
    } else if (field.children) {
      if (!utils.isUndefined(field.name)) {
        fieldTemplate = this.getFieldTempate(field);
      } else {
        this.addRowFieldInfo(field);
      }
      fieldTemplate += this.childTemplate(field, fieldStyle);
    } else {
      fieldTemplate = this.getFieldTempate(field);
    }
    return fieldTemplate;
  }

  /**
   * child template
   *
   * @param {FormField} field
   * @param {FieldStyle} parentFieldStyle
   * @returns {*}
   */
  public childTemplate(field: FormField, parentFieldStyle: FieldStyle) {
    const template = [];

    let beforeField: FormField = null as any;
    let firstFlag = true;
    let isEmptyLabel = false;
    template.push(`<div class="df-row ${parentFieldStyle.rowStyleClass}">`);
    for (const childField of field.children) {
      childField.$parent = field;

      if (this.checkHiddenField(childField)) {
        continue;
      }

      if (firstFlag) {
        beforeField = childField;
      }

      let labelHideFlag = this.isLabelHide(childField);

      let childFieldStyle;

      let labelTemplate = "";
      if (labelHideFlag) {
        childFieldStyle = styleUtils.fieldStyle(this.options, childField, beforeField, !isEmptyLabel);
        labelTemplate = isEmptyLabel ? `<span class="df-label empty ${childFieldStyle.labelClass}" style="${childFieldStyle.labelStyle}"></span>` : "";
      } else {
        childFieldStyle = styleUtils.fieldStyle(this.options, childField, beforeField, false);
        labelTemplate = `<span class="df-label ${childFieldStyle.labelClass} ${childFieldStyle.labelAlignClass}" title="${childField.label ?? ""}" style="${childFieldStyle.labelStyle}">${this.getLabelTemplate(childField)}</span>`;
      }

      let childFieldTempate = "";

      if (childField.children) {
        childFieldTempate = this.getTemplate(childField, childFieldStyle);
      } else {
        childFieldTempate = this.getTemplate(childField, parentFieldStyle);
      }

      template.push(`<div class="form-group ${childFieldStyle.fieldClass}" style="${childFieldStyle.fieldStyle}" id="${childField.$key}">
        ${labelTemplate}
        <span class="df-field-container ${childFieldStyle.valueClass} ${childField.required ? "required" : ""}" style="${childFieldStyle.valueStyle}">${childFieldTempate}</span>
      </div>`);

      if (!labelHideFlag) {
        isEmptyLabel = true;
      }

      firstFlag = false;
    }

    template.push("</div>");

    return template.join("");
  }

  /**
   * label template
   *
   * @param {FormField} field form field
   * @returns {string} template string
   */
  public getLabelTemplate(field: FormField) {
    const requiredTemplate = field.required ? `<span class="required"></span>` : "";
    const tooltipTemplate = utils.isBlank(field.tooltip) ? "" : `<span class="df-tooltip">?<span class="tooltip">${field.tooltip}</span></span>`;

    return `${field.label ?? ""} ${tooltipTemplate} ${requiredTemplate}`;
  }

  private tabTemplate(field: FormField) {
    this.addRowFieldInfo(field);

    return TabRender.template(field, this, this.options);
  }

  private gridTemplate(field: FormField) {
    this.addRowFieldInfo(field);

    return GridRender.template(field, this, this.options);
  }

  /**
   * label 숨김 여부
   *
   * @param field formfield
   * @returns
   */
  private isLabelHide(field: FormField): boolean {
    return field.style?.labelHide || utils.isUndefined(field.label);
  }

  /**
   * field tempalte 구하기
   *
   * @param {FormField} field
   * @returns {string}
   */
  public getFieldTempate(field: FormField): string {
    if (!utils.isBlank(field.name) && this.fieldInfoMap.hasFieldName(field.name)) {
      throw new Error(`Duplicate field name "${field.name}"`);
    }

    this.addRowFieldInfo(field);

    return (field.$renderer as any).template(field);
  }

  public checkHiddenField(field: FormField) {
    const isHidden = utils.isHiddenField(field);

    if (isHidden) {
      this.fieldInfoMap.addField(field);
      field.$renderer = new (field.$renderer as any)(field, null, this.daraform);

      return true;
    }

    return false;
  }

  /**
   * add row file map
   *
   * @param {FormField} field
   */
  public addRowFieldInfo(field: FormField) {
    utils.replaceXssField(field);
    this.fieldInfoMap.addField(field);
    this.addRowFields.push(field.$key);
  }
}
