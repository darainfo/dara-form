import { FieldStyle, FormField } from "@t/FormField";
import Render from "./Render";
import { invalidMessage } from "src/util/validUtils";
import { stringValidator } from "src/rule/stringValidator";
import DaraForm from "src/DaraForm";
import FormTemplate from "src/FormTemplate";
import styleUtils from "src/util/styleUtils";
import { FormOptions } from "@t/FormOptions";

export default class TabRender extends Render {
  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm, field, rowElement);
    this.initEvent();
  }

  initEvent() {}

  static template(field: FormField, formTemplate: FormTemplate, options: FormOptions): string {
    let tabTemplate = [];
    let tabChildTemplate = [];

    //tab 이벤트 처리 할것.

    if (field.children) {
      let fieldStyle = styleUtils.fieldStyle(options, field);

      for (const childField of field.children) {
        formTemplate.addRowFieldInfo(childField);
        let id = childField.$key;
        tabTemplate.push(`<li class="tab-item" data-tab-id="${id}"><a href="javascript:;">${childField.label}</a></li>`);

        tabChildTemplate.push(`<div class="tab-panel" tab-panel-id="${id}">`);
        if (childField.children) {
          tabChildTemplate.push(formTemplate.childTemplate(childField, fieldStyle));
        }
        tabChildTemplate.push(`</div>`);
      }
    }

    return `
     <div class="df-field">
      <ul class="tab-header">
      ${tabTemplate.join("")}
      </ul>
     </div>
     <div class="df-tab-body">
      ${tabChildTemplate.join("")}
     </div>
     `;
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
