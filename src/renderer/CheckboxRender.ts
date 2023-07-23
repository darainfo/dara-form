import { FormField } from "@t/FormField";
import Render from "./Render";
import XssUtil from "src/util/util";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtil";

export default class CheckboxRender implements Render {
    private rowElement: HTMLElement;
    private field;
    private defaultCheckValue: any[]

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.defaultCheckValue = [];

        this.field.values.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue.push(val.value);
            }
        });

        this.initEvent();
    }

    public initEvent() {
        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
        
        checkboxes.forEach(ele=>{
            ele.addEventListener('change', (e: Event) => {
                this.valid();
            })
        })
    }

    public getSelector(){
        return `input[type="checkbox"][name="${this.field.$xssName}"]`;
    }

    static template(field: FormField): string {
        const templates: string[] = [];
        const fieldName = field.name;

        templates.push(` <div class="dara-form-field"><div class="field-group">`);
        field.values.forEach((val) => {

            templates.push(`
                <span class="field ${field.viewMode == 'vertical' ? "vertical" : "horizontal"}">
                    <label>
                        <input type="checkbox" name="${fieldName}" value="${XssUtil.replace(val.value)}" class="form-field checkbox" ${val.selected ? 'checked' : ''}/>
                        ${val.label}
                    </label>
                </span>
            `);
        })
        templates.push(`<i class="dara-icon help-icon"></i></div></div>`);

        return templates.join('');
    }

    getValue(): any[] {
        const checkValue: any[] = [];

        this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]:checked`).forEach(item => {
            checkValue.push((item as HTMLInputElement).value);

        })

        return checkValue;
    }

    setValue(value: any): void {
        let valueArr: any[] = [];
        if (Array.isArray(value)) {
            valueArr = value;
        } else {
            valueArr.push(value);
        }

        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
        
        checkboxes.forEach(ele=>{
            (ele as HTMLInputElement).checked = false;
        })

        valueArr.forEach(val => {
            const ele = this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${val}"]`) as HTMLInputElement;
            if(ele) ele.checked = true;
        })
    }

    reset() {
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
            if (value.length < 1) {
                validResult = { name: this.field.name, constraint: [] };
                validResult.constraint.push(RULES.REQUIRED);
            }
        }

        invalidMessage(this.field, this.rowElement, validResult);

        return true;
    }
}