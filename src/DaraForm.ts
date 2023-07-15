import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import NumberRender from './renderer/NumberRender';
import TextAreaRender from './renderer/TextAreaRender';
import DropdownRender from './renderer/DropdownRender';
import TextRender from './renderer/TextRender';
import { getRenderTemplate, getRenderer } from './template';
import XssUtil from './util/util';
import { render } from 'preact';
import { ValidResult } from '@t/ValidResult';
import { Message } from '@t/Message';
import Lanauage from './util/Lanauage';


let defaultOptions = {
    mode: 'horizontal' // horizontal , vertical // 가로 세로 모드
    , width: '100%'
    , labelWidth: '20%'
    , notValidMessage: 'This form is not valid.'
    , fields: []
} as FormOptions;

let daraFormIdx = 0;

export interface FieldMap {
    [key: string]: FormField;
}

export default class DaraForm {
    private readonly options;
    private isHorizontal;

    private formElement;

    private allFieldInfo: FieldMap = {};

    private addRowField: string[] = [];

    constructor(selector: string, options: FormOptions, message : Message) {
        this.options = Object.assign({}, defaultOptions, options);
        
        daraFormIdx += 1;

        Lanauage.set(message);

        this.isHorizontal = this.options.mode === 'horizontal';

        const formElement = document.createElement("form");
        formElement.className = `dara-form df-${daraFormIdx} ${this.isHorizontal ? 'horizontal' : 'vertical'}`;
        formElement.setAttribute('style', `width:${this.options.width};`);

        document.querySelector(selector)?.appendChild(formElement);

        this.formElement = formElement;
        this.createForm(this.options.fields);
    }

    public static setMessage(message : Message):void{
        Lanauage.set(message);
    }

    createForm(fields: FormField[]) {
        fields.forEach((field) => {
            this.addRow(field);
        })
    }

    addRow(field: FormField) {
        this.addRowField = [];
        const rowElement = document.createElement("div");
        rowElement.className = `dara-form-row`;

        replaceXssField(field);

        let rednerTemplate = '';
        if (field.renderer) {
            const templateValue = (field.renderer as any).template;
            if (typeof templateValue === 'string') {
                rednerTemplate = templateValue;
            } else {
                rednerTemplate = templateValue.call(null, field);
            }
            field.$isCustomRenderer = true;
        } else {
            rednerTemplate = this.rowTemplate(field);
        }

        rowElement.innerHTML = rednerTemplate;

        this.formElement.appendChild(rowElement); // Append the element

        this.addRowField.forEach(fieldName => {
            if (this.allFieldInfo[fieldName].$isCustomRenderer !== true) {
                field.$xssName = XssUtil.unFieldName(field.name);
                field.renderer = new (field.renderer as any)(field, rowElement);
            }
        })
    }

    rowTemplate(field: FormField) {
        let fieldHtml = '';

        if (field.childen) {
            fieldHtml = this.groupTemplate(field);
        } else {
            fieldHtml = this.getFieldTempate(field);
        }

        return `
            <div class="dara-form-label" style="${this.isHorizontal ? `width:${this.options.labelWidth};` : ''}">
                <span>${field.label}<span class="${field.required ? 'require' : ''}"></span></span>
            </div>
            <div class="dara-form-field">
                <span>${fieldHtml}<i class="help-icon"></i></span>
                <div class="help-message"></div>
            </div>
        `;
    }


    /**
     * 그룹 템플릿
     *
     * @param {FormField} field
     * @returns {*}
     */
    groupTemplate(field: FormField) {
        const childTemplae = [];
        childTemplae.push(`<ul class="sub-field-group ${field.renderType === 'group' ? 'group-inline' : 'group-row'}">`);
        field.childen.forEach(childField => {
            if (childField.childen) {
                childTemplae.push(this.rowTemplate(field));
            } else {
                replaceXssField(childField);
                childTemplae.push(`<li class="sub-row">
                        <span class="sub-label">${childField.label}</span>
                        <span class="sub-field">${this.getFieldTempate(childField)}</span>
                    </li>`
                );
            }
        })
        childTemplae.push('</ul>');

        return childTemplae.join('');
    }


    /**
     * field tempalte 구하기
     *
     * @param {FormField} field
     * @returns {string}
     */
    getFieldTempate(field: FormField): string {
        this.allFieldInfo[field.name] = field;
        this.addRowField.push(field.name);
        field.renderer = getRenderer(field);
        return (field.renderer as any).template(field);
    }


    /**
     * 폼 데이터 reset
     */
    resetForm = () => {
        this.formElement.reset();
    }

    resetField = (fieldName: string) => {
        const element = this.getFieldElement(fieldName);

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            element.value = '';
        }
    }

    getFieldElement(fieldName: string) {
        const field = this.allFieldInfo[fieldName];

        if (field) {
            return field.renderer.getValue();
        }

        return null;
    }

    getFieldValue = (fieldName: string) => {

        const field = this.allFieldInfo[fieldName];

        if (field) {
            return field.renderer.getValue();
        }
        return null;

    }

    getValue = (isValid: boolean): any => {

        let reval = {} as any;
        Object.keys(this.allFieldInfo).forEach((fieldName) => {
            const filedInfo = this.allFieldInfo[fieldName];
            const renderInfo = filedInfo.renderer;
            if (isValid) {
                let fieldValid =renderInfo.valid();

                if(fieldValid !== true){
                    fieldValid = fieldValid as ValidResult;
                    throw new Error(`field name "${fieldValid.name}" "${fieldValid.constraint}" not valid`);
                }
            }
            
            reval[fieldName] = renderInfo.getValue();
        })
       
        return reval;
    }

    addField = (field: FormField) => {
        this.options.fields.push(field);
        this.addRow(field);
    }

    removeField = (fieldName: string) => {
        const element = this.getFieldElement(fieldName);

        if (element != null) {
            element.closest('.dara-form-row')?.remove();

            delete this.allFieldInfo[fieldName];
        }
    }

    isValidForm = (): boolean => {
        const result = this.validForm();
        return result.length > 0 ? false : true;
    }

    validForm = (): any[] => {
        let validResult = [] as any;
        for(const fieldName in this.allFieldInfo){
            const filedInfo = this.allFieldInfo[fieldName];
            const renderInfo = filedInfo.renderer;
            
            let fieldValid =renderInfo.valid();

            if(fieldValid !== true){
                validResult.push(fieldValid);
            }
        }

        return validResult;
    }

    isValidField = (fieldName: string): boolean => {
        return true;
    }

    getOptions = () => {
        return this.options;
    }

    destroy = () => {
        return this.options;
    }
}

function replaceXssField(field: FormField) {
    field.name = XssUtil.replace(field.name);
    field.label = XssUtil.replace(field.label);
}
