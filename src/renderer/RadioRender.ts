import { FormField } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import util from "src/util/utils";
import { customChangeEventCall } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class RadioRender extends Render {
    private defaultCheckValue;

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm, field, rowElement);
        this.defaultCheckValue = this.field.values[0].value;

        this.field.values.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue = val.value;
            }
        });
        this.initEvent();
    }

    public initEvent() {
        const checkboxes = this.rowElement.querySelectorAll(this.getSelector());

        checkboxes.forEach(ele => {
            ele.addEventListener('change', (e: Event) => {
                customChangeEventCall(this.field, e, this);

                this.valid();
            })
        })
    }

    public getSelector() {
        return `input[type="radio"][name="${this.field.$xssName}"]`;
    }

    static template(field: FormField): string {
        const templates: string[] = [];
        const fieldName = field.name;

        const desc = field.description ? `<div>${field.description}</div>` : '';

        templates.push(`<div class="df-field"><div class="field-group">`);
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
        templates.push(`<i class="dara-icon help-icon"></i></div></div>
        ${desc}
        <div class="help-message"></div>
         `);


        return templates.join('');
    }

    public setValueItems(items: any): void {

        const containerEle = this.rowElement.querySelector('.df-field-container');
        if (containerEle) {
            this.field.values = items;
            containerEle.innerHTML = RadioRender.template(this.field);

            this.initEvent();
        }
    }

    getValue() {
        return (this.rowElement.querySelector(`[name="${this.field.$xssName}"]:checked`) as HTMLInputElement)?.value;
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

        const elements = this.rowElement.querySelectorAll(this.getSelector());

        elements.forEach(ele => {
            let radioEle = ele as HTMLInputElement;
            if (radioEle.value == value) {
                radioEle.checked = true;
            } else {
                radioEle.checked = false;
            }
        })
    }

    reset() {
        this.setValue(this.defaultCheckValue);
        resetRowElementStyleClass(this.rowElement);
    }

    getElement(): any {
        return this.rowElement.querySelectorAll(this.getSelector());
    }

    valid(): any {
        const value = this.getValue();

        let validResult: ValidResult | boolean = true;

        if (this.field.required) {
            if (util.isBlank(value)) {
                validResult = { name: this.field.name, constraint: [] };
                validResult.constraint.push(RULES.REQUIRED);
            }
        }

        invalidMessage(this.field, this.rowElement, validResult);

        return true;
    }

}