import { FormField } from "@t/FormField";
import Render from "./Render";
import XssUtil from "src/util/utils";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { customChangeEventCall } from "src/event/renderEvents";
import util from "src/util/utils";
import DaraForm from "src/DaraForm";

export default class CheckboxRender extends Render {
    private field;
    private defaultCheckValue: any[] = [];

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm, rowElement);
        this.field = field;
        this.rowElement = rowElement;

        this.initEvent();
    }

    public initEvent() {
        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());
        this.defaultCheckValue = [];
        this.field.values.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue.push(val.value);
            }
        });

        checkboxes.forEach(ele => {
            ele.addEventListener('change', (e: Event) => {
                customChangeEventCall(this.field, e, this);
                this.valid();
            })
        })
    }

    public getSelector() {
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
                        <input type="checkbox" name="${fieldName}" value="${val.value ? XssUtil.replace(val.value) : ''}" class="form-field checkbox" ${val.selected ? 'checked' : ''}/>
                        ${val.label}
                    </label>
                </span>
            `);
        })
        templates.push(`<i class="dara-icon help-icon"></i></div></div>
        <div class="help-message"></div>
        `);


        return templates.join('');
    }

    public setValueItems(items: any): void {

        const containerEle = this.rowElement.querySelector('.dara-form-field-container');
        if (containerEle) {
            this.field.values = items;
            containerEle.innerHTML = CheckboxRender.template(this.field);

            this.initEvent();
        }
    }

    getValue() {

        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

        if (checkboxes.length > 1) {
            const checkValue: any[] = [];
            checkboxes.forEach(ele => {
                const checkEle = ele as HTMLInputElement;
                if (checkEle.checked) {
                    checkValue.push(checkEle.value);
                }
            });
            return checkValue;
        } else {
            return this.rowElement.querySelectorAll(`[name="${this.field.$xssName}"]:checked`).length > 0;
        }
    }

    setValue(value: any): void {
        this.field.$value = value;
        if (value === true) {
            (this.rowElement.querySelector(`[name="${this.field.$xssName}"]`) as HTMLInputElement).checked = true;
            return;
        }

        if (value === false) {
            (this.rowElement.querySelector(`[name="${this.field.$xssName}"]`) as HTMLInputElement).checked = false;
            return;
        }

        let valueArr: any[] = [];
        if (Array.isArray(value)) {
            valueArr = value;
        } else {
            valueArr.push(value);
        }

        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

        checkboxes.forEach(ele => {
            (ele as HTMLInputElement).checked = false;
        })

        valueArr.forEach(val => {
            const ele = this.rowElement.querySelector(`[name="${this.field.$xssName}"][value="${val}"]`) as HTMLInputElement;
            if (ele) ele.checked = true;
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

        if (this.field.required && util.isArray(value)) {

            if ((value as any[]).length < 1) {
                validResult = { name: this.field.name, constraint: [] };
                validResult.constraint.push(RULES.REQUIRED);
            }
        }

        invalidMessage(this.field, this.rowElement, validResult);

        return true;
    }
}