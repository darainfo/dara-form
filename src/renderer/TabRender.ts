import { FieldStyle, FormField } from "@t/FormField";
import Render from "./Render";
import { invalidMessage } from "src/util/validUtils";
import { stringValidator } from "src/rule/stringValidator";
import DaraForm from "src/DaraForm";
import FormTemplate from "src/FormTemplate";
import styleUtils from "src/util/styleUtils";
import { FormOptions } from "@t/FormOptions";

export default class TabRender extends Render {
  private tabContainerElement: HTMLElement;
  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);

    this.mounted();
  }

  mounted() {
    this.tabContainerElement.querySelectorAll(".tab-item").forEach((tabItem) => {
      tabItem.addEventListener("click", (e: any) => {
        this.clickEventHandler(tabItem, e);
      });
    });
  }

  /**
   * tab item click
   *
   * @param {Element} tabItem
   * @param {*} evt
   */
  private clickEventHandler(tabItem: Element, evt: any) {
    this.setActive(tabItem.getAttribute("data-tab-id") ?? "");
  }

  public setActive(tabId: string): void {
    const tabItem = this.tabContainerElement.querySelector(`[data-tab-id="${tabId}"]`);

    if (!tabItem) return;

    if (!tabItem.classList.contains("active")) {
      for (let item of tabItem?.parentElement?.children ?? []) {
        item.classList.remove("active");
      }
      tabItem.classList.add("active");
    }

    const tabPanel = this.rowElement.querySelector(`[tab-panel-id="${tabId}"]`);

    if (!tabPanel?.classList.contains("active")) {
      for (let item of tabPanel?.parentElement?.children ?? []) {
        item.classList.remove("active");
      }

      tabPanel?.classList.add("active");
    }
  }

  static isDataRender(): boolean {
    return false;
  }

  static isChildrenCreate(): boolean {
    return false;
  }

  /**
   * tab template
   *
   * @param {FormField} field
   * @param {FormTemplate} formTemplate
   * @param {FormOptions} options
   * @returns {string} template string
   */

  createField() {
    const field = this.field;

    const formTemplate = this.daraForm.formTemplate;
    const options = this.daraForm.getOptions();

    const fieldContainerElement = this.rowElement.querySelector(".df-field-container") as HTMLElement;
    let tabTemplate = [];
    let tabChildTemplate = [];

    //tab 이벤트 처리 할것.
    let fieldStyle = styleUtils.fieldStyle(options, field);

    console.log("tab", field);

    if (field.children) {
      let firstFlag = true;
      for (const childField of field.children) {
        childField.$parent = field;
        formTemplate.addRowFieldInfo(childField);
        let id = childField.$key;

        tabTemplate.push(`<span class="tab-item ${firstFlag ? "active" : ""}" data-tab-id="${id}"><a href="javascript:;">${childField.label}</a></span>`);

        tabChildTemplate.push(`<div class="tab-panel ${firstFlag ? "active" : ""}" tab-panel-id="${id}">${Render.getDescriptionTemplate(childField)}`);

        tabChildTemplate.push(`</div>`);

        if (childField.children) {
          // 새로운 폼으로 해서 처리 할것.

          tabChildTemplate.push(formTemplate.childTemplate(childField, fieldStyle));
        }
        firstFlag = false;
      }
    }

    fieldContainerElement.innerHTML = `
     <div class="df-field ">
      <div class="tab-header ${fieldStyle.tabAlignClass}">
      ${tabTemplate.join("")}
      </div>
     </div>
     <div class="df-tab-body">
      ${tabChildTemplate.join("")}
     </div>
     `;

    this.tabContainerElement = fieldContainerElement;
  }

  getValue() {
    return "";
  }

  setValue(value: any): void {}

  reset() {}

  getElement(): Element {
    return this.rowElement;
  }

  valid(): any {
    const validResult = stringValidator(this.getValue(), this.field);

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
