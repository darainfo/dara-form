import { FormField } from "@t/FormField";
import Render from "./Render";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { dropdownChangeEvent } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class DropdownRender extends Render {
    private element: HTMLSelectElement;
    private field;
    private defaultCheckValue;

    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
        super(daraForm, rowElement);
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLSelectElement;

        this.defaultCheckValue = this.field.values[0].value;

        this.field.values.forEach((val) => {
            if (val.selected) {
                this.defaultCheckValue = val.value;
            }
        });

        this.initEvent();
    }

    initEvent() {
        dropdownChangeEvent(this.field, this.element, this);
    }

    static template(field: FormField): string {
        let template = ` <div class="dara-form-field"><select name="${field.name}" class="form-field dropdown">`;

        field.values.forEach(val => {
            template += `<option value="${val.value}" ${val.selected ? 'selected' : ''}>${val.label}</option>`;
        })

        template += `</select> <i class="help-icon"></i></div>
                    <div class="help-message"></div>
        `;
        return template;
    }

    public setValueItems(items: any): void {

        const containerEle = this.rowElement.querySelector('.dara-form-field-container');
        if (containerEle) {
            this.field.values = items;
            containerEle.innerHTML = DropdownRender.template(this.field);

            this.initEvent();
        }
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }

    reset() {
        this.setValue(this.defaultCheckValue);
        resetRowElementStyleClass(this.rowElement);
    }

    getElement(): HTMLElement {
        return this.element;
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