import { FormField } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtil";
import util from "src/util/util";

export default class RadioRender implements Render {
    private rowElement: HTMLElement;
    private field;
    private defaultCheckValue;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.defaultCheckValue = this.field.values[0].value;

        this.field.values.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue = val.value;
            }
        });
    }

    public initEvent() { }

    static template(field: FormField): string {
        const templates: string[] = [];
        const fieldName = field.name;

        templates.push(`<div class="dara-form-field"><div class="field-group">`);
        field.values.forEach((val) => {

            templates.push(
                `<span class="field ${field.viewMode == 'vertical' ? "vertical" : "horizontal"}">
                <label>
                    <input type="radio" name="${fieldName}" value="${val.value}" class="form-field radio" ${val.selected ? 'checked' : ''} />
                    ${val.label}
                </label>
                </span>
                `
            )
        })
        templates.push(`<i class="dara-icon help-icon"></i></div></div> `);

        return templates.join('');
    }

    getValue() {
        return (this.rowElement.querySelector(`[name="${this.field.$xssName}"]:checked`) as HTMLInputElement)?.value;
    }

    setValue(value: any): void {
        const ele = this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${value}"]`) as HTMLInputElement;
        ele.checked = true;
    }

    reset() {
        this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`).forEach(item => {
            (item as HTMLInputElement).checked = false;
        })

        console.log('this.defaultCheckValue : ', this.defaultCheckValue)
        this.setValue(this.defaultCheckValue);
        resetRowElementStyleClass(this.rowElement);
    }

    getElement(): any {
        return this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]`);
    }

    valid(): any {
        const value = this.getValue();

        let validResult: ValidResult | boolean = true;

        if (this.field.required) {
            if (util.isEmpty(value)) {
                validResult = { name: this.field.name, constraint: [] };
                validResult.constraint.push(RULES.REQUIRED);
            }
        }

        invalidMessage(this.field, this.rowElement, validResult);

        return true;
    }

}