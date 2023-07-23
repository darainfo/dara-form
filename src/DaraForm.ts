import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import { getRenderer } from './util/renderFactory';
import utils from './util/util';
import { ValidResult } from '@t/ValidResult';
import { Message } from '@t/Message';
import Lanauage from './util/Lanauage';
import { stringValidator } from './rule/stringValidator';
import { numberValidator } from './rule/numberValidator';
import { regexpValidator } from './rule/regexpValidator';

let defaultOptions = {
    mode: 'horizontal' // horizontal , vertical // 가로 세로 모드
    , width: '100%'
    , labelWidth: '20%'
    , notValidMessage: 'This form is not valid.'
    , fields: []
} as FormOptions;

let daraFormIdx = 0;

interface FieldMap {
    [key: string]: FormField;
}

export default class DaraForm {
    private readonly options;
    private isHorizontal;

    private formElement;

    private allFieldInfo: FieldMap = {};

    private addRowFields: string[] = [];

    constructor(selector: string, options: FormOptions, message: Message) {
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

    public static setMessage(message: Message): void {
        Lanauage.set(message);
    }

    createForm(fields: FormField[]) {
        fields.forEach((field) => {
            this.addRow(field);
        })
    }

    /**
     * field row 추가.
     * 
     * @param field 
     */
    addRow(field: FormField) {
        this.addRowFields = [];
        const rowElement = document.createElement("div");
        rowElement.className = `dara-form-row`;

        replaceXssField(field);

        let rednerTemplate = '';
        if (field.renderer) {
            field.$isCustomRenderer = true;
        }

        rednerTemplate = this.rowTemplate(field);

        rowElement.innerHTML = rednerTemplate;

        this.formElement.appendChild(rowElement); // Append the element

        this.addRowFields.forEach(fieldName => {
            const fileldInfo = this.allFieldInfo[fieldName];
            fileldInfo.$xssName = utils.unFieldName(fileldInfo.name);
            fileldInfo.$renderer = new (fileldInfo.$renderer as any)(fileldInfo, rowElement);
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
            <div class="dara-form-field-container">
                ${fieldHtml}
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
        this.addRowFields.push(field.name);
        field.$renderer = getRenderer(field);
        return (field.$renderer as any).template(field);
    }


    /**
     * 폼 데이터 reset
     */
    resetForm = () => {
        for (const fieldName in this.allFieldInfo) {
            const filedInfo = this.allFieldInfo[fieldName];
            const renderInfo = filedInfo.$renderer;

            if (renderInfo && typeof renderInfo.reset === 'function') {
                renderInfo.reset();
            }
        }
    }

    /**
     * field 값 reset
     * @param fieldName 필드명
     */
    resetField = (fieldName: string) => {
        this.allFieldInfo[fieldName].$renderer.reset();
    }


    /**
     * 필드 element 얻기
     *
     * @param {string} fieldName
     * @returns {*}
     */
    getFieldElement(fieldName: string) {
        const field = this.allFieldInfo[fieldName];

        if (field?.$renderer) {
            return field.$renderer.getElement();
        }

        return null;
    }

    /**
     * field 값 얻기
     * 
     * @param fieldName  필드명
     * @returns 
     */
    getFieldValue = (fieldName: string) => {

        const field = this.allFieldInfo[fieldName];

        if (field) {
            return field.$renderer.getValue();
        }
        return null;
    }

    /**
     * 폼 필드 값 얻기
     * @param isValid 폼 유효성 검사 여부 default:false|undefined true일경우 검사.
     * @returns 
     */
    getValue = (isValid: boolean): any => {

        let reval = {} as any;
        Object.keys(this.allFieldInfo).forEach((fieldName) => {
            const filedInfo = this.allFieldInfo[fieldName];
            const renderInfo = filedInfo.$renderer;
            if (isValid) {
                let fieldValid = renderInfo.valid();

                if (fieldValid !== true) {
                    fieldValid = fieldValid as ValidResult;
                    throw new Error(`field name "${fieldValid.name}" "${fieldValid.constraint}" not valid`);
                }
            }

            reval[fieldName] = renderInfo.getValue();
        })

        return reval;
    }

    /**
     * 폼 필드 value 셋팅
     * @param values 
     */
    setValue = (values: any) => {
        Object.keys(values).forEach((fieldName) => {
            const value = values[fieldName];
            const filedInfo = this.allFieldInfo[fieldName];

            if (filedInfo) {
                const renderInfo = filedInfo.$renderer;
                renderInfo.setValue(value);
            }
        })
    }

    /**
     * field 추가
     *
     * @param {FormField} field
     */
    addField = (field: FormField) => {
        this.options.fields.push(field);
        this.addRow(field);
    }

    /**
     * field 제거
     *
     * @param {string} fieldName
     */
    removeField = (fieldName: string) => {
        const element = this.getFieldElement(fieldName);

        if (element != null) {
            element.closest('.dara-form-row')?.remove();

            delete this.allFieldInfo[fieldName];
        }
    }

    /**
     * 폼 유효성 검증 여부  
     *
     * @returns {boolean}
     */
    isValidForm = (): boolean => {
        const result = this.validForm();
        return result.length > 0 ? false : true;
    }


    /**
     * 유효성 검증 폼 검증여부 리턴
     *
     * @returns {any[]}
     */
    validForm = (): any[] => {
        let validResult = [] as any;
        for (const fieldName in this.allFieldInfo) {
            const filedInfo = this.allFieldInfo[fieldName];
            const renderInfo = filedInfo.$renderer;

            let fieldValid = renderInfo.valid();

            if (fieldValid !== true) {
                validResult.push(fieldValid);
            }
        }

        return validResult;
    }

    isValidField = (fieldName: string): boolean => {
        const filedInfo = this.allFieldInfo[fieldName];
        const renderInfo = filedInfo.$renderer;
        if (renderInfo) {
            return renderInfo.valid() === true ? true : false;
        }

        return true;
    }

    getOptions = () => {
        return this.options;
    }

    /*
    destroy = () => {
        return this.options;
    }
    */

    public static validator = {
        string: (value: string, field: FormField) => {
            return stringValidator(value, field);
        }
        , number: (value: string, field: FormField) => {
            return numberValidator(value, field);
        }
        , regexp: (value: string, field: FormField) => {
            let result: ValidResult = { name: field.name, constraint: [] };
            return regexpValidator(value, field, result);
        }

    }

}

function replaceXssField(field: FormField) {
    field.name = utils.replace(field.name);
    field.label = utils.replace(field.label);
}
