import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import NumberRender from './renderer/NumberRender';
import TextAreaRender from './renderer/TextAreaRender';
import DropdownRender from './renderer/DropdownRender';
import TextRender from './renderer/TextRender';
import { fieldTemplate } from './template';


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

export default class DaraForm {
    private readonly options;
    private isHorizontal;

    private formElement;

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

        const rowElement = document.createElement("div");
        rowElement.className = `dara-form-row`;

        let rednerTemplate = '';
        if (field.template) {
            if (typeof field.template === 'string') {
                rednerTemplate = field.template;
            } else {
                rednerTemplate = field.template.call(null, field);
            }
        } else {
            rednerTemplate = this.rowTemplate(field);
        }

        rowElement.innerHTML = rednerTemplate;

        this.formElement.appendChild(rowElement); // Append the element
    }

    rowTemplate(field: FormField) {
        let fieldHtml = '';

        if (field.childen) {
            fieldHtml = this.groupTemplate(field);
        } else {
            fieldHtml = fieldTemplate(field);
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

    groupTemplate(field: FormField) {
        //그룹 처리 할것. 
        const childTemplae = [];
        childTemplae.push(`<ul class="sub-field-group ${field.renderType === 'group' ? 'group-inline' : 'group-row'}">`);
        field.childen.forEach(childField => {
            if (childField.childen) {
                childTemplae.push(this.rowTemplate(field));
            } else {
                childTemplae.push(`<li class="sub-row">
                        <span class="sub-label">${childField.label}</span>
                        <span class="sub-field">${fieldTemplate(childField)}</span>
                    </li>`
                );
            }
        })
        childTemplae.push('</ul>');

        return childTemplae.join('');
    }

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
        return this.formElement.querySelector(`[name="${fieldName}"]`);
    }

    getFieldValue = (fieldName: string) => {
        const element = this.getFieldElement(fieldName);

        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            return element.value;
        }
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