import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import NumberRender from './renderer/NumberRender';
import TextAreaRender from './renderer/TextAreaRender';
import DropdownRender from './renderer/DropdownRender';
import TextRender from './renderer/TextRender';
import { getRenderTemplate, getRenderer } from './template';
import XssUtil from './util/XssUtil';


let defaultOptions = {
    mode: 'horizontal' // horizontal , vertical // 가로 세로 모드
    , width: '100%'
    , labelWidth: '20%'
    , notValidMessage: 'This value is not valid'
    , message: {
        empty: '{name} 필수 입력사항입니다.'
        , "string": {
            minLength: '{size} 글자 이상 입력해야합니다.'
            , maxLength: '{size} 글자 이상 입력할 수 없습니다.'
        }
        , "number": {
            min: '{size} 보다 커야 합니다'
            , max: '{size} 보다 커야 합니다'
        }
        , "type": {
            email: '이메일이 유효하지 않습니다.'
            , url: 'URL이 유효하지 않습니다.'
        }
    }
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

    constructor(selector: string, options: FormOptions) {
        this.options = Object.assign({}, defaultOptions, options);
        daraFormIdx += 1;

        this.isHorizontal = this.options.mode === 'horizontal';

        const formElement = document.createElement("form");
        formElement.className = `dara-form df-${daraFormIdx} ${this.isHorizontal ? 'horizontal' : 'vertical'}`;
        formElement.setAttribute('style', `width:${this.options.width};`);

        document.querySelector(selector)?.appendChild(formElement);

        this.formElement = formElement;
        this.createForm(this.options.fields);
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
                field.renderer = new (field.renderer as any)(field, rowElement);
            }
        })
        //field.renderer = getRenderer(field);
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
                <span>${fieldHtml}</span>
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

        if (isValid) {
            if (!this.isValidForm()) {
                return;
            };
        }
        const fields = this.options.fields;

        let reval = {} as any;
        fields.forEach((field: FormField) => {
            reval[field.name] = this.getFieldValue(field.name);
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
        return true;
    }

    validForm = (): boolean => {
        return true;
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
