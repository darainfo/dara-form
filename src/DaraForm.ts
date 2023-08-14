import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import utils from './util/utils';
import { ValidResult } from '@t/ValidResult';
import { Message } from '@t/Message';
import Lanauage from './util/Lanauage';
import { stringValidator } from './rule/stringValidator';
import { numberValidator } from './rule/numberValidator';
import { regexpValidator } from './rule/regexpValidator';
import FieldInfoMap from 'src/FieldInfoMap';
import GroupRender from './renderer/GroupRender';

const defaultOptions = {
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

    private fieldInfoMap;

    private addRowFields: string[] = [];

    constructor(selector: string, options: FormOptions, message: Message) {
        this.options = Object.assign({}, defaultOptions, options);

        daraFormIdx += 1;

        Lanauage.set(message);
        this.fieldInfoMap = new FieldInfoMap(selector);

        this.isHorizontal = this.options.mode === 'horizontal';

        const formElement = document.querySelector(selector);
        if (formElement) {
            formElement.className = `dara-form df-${daraFormIdx} ${this.isHorizontal ? 'horizontal' : 'vertical'}`;
            formElement.setAttribute('style', `width:${this.options.width};`);

            this.formElement = formElement;
            this.createForm(this.options.fields);
        } else {
            throw new Error(`${selector} form selector not found`);
        }

    }

    public static setMessage(message: Message): void {
        Lanauage.set(message);
    }

    createForm(fields: FormField[]) {
        fields.forEach((field) => {
            this.addRow(field);
        })
        this.conditionCheck();
    }

    /**
     * field row 추가.
     * 
     * @param field 
     */
    addRow(field: FormField) {

        if (this.checkHiddenField(field)) {
            return;
        }

        this.addRowFields = [];
        const rowElement = document.createElement("div");
        rowElement.className = `df-row`;

        let rednerTemplate = this.rowTemplate(field);

        rowElement.setAttribute('id', field.$key);

        rowElement.innerHTML = rednerTemplate;

        this.formElement.appendChild(rowElement); // Append the element

        this.addRowFields.forEach(fieldSeq => {
            const fileldInfo = this.fieldInfoMap.get(fieldSeq);
            fileldInfo.$xssName = utils.unFieldName(fileldInfo.name);

            const fieldRowElement = this.formElement.querySelector(`#${fileldInfo.$key}`);
            fileldInfo.$renderer = new (fileldInfo.$renderer as any)(fileldInfo, fieldRowElement, this);
            fieldRowElement?.removeAttribute('id');
        })
    }

    rowTemplate(field: FormField) {
        let fieldHtml = '';

        if (field.children) {
            this.addRowFieldInfo(field);
            fieldHtml = this.groupTemplate(field);
        } else {
            fieldHtml = this.getFieldTempate(field);
        }

        if (this.checkHiddenField(field)) {
            return '';
        }

        return `
            <div class="df-label" style="${this.isHorizontal ? `width:${this.options.labelWidth};` : ''}">
                <span>${this.getLabelTemplate(field)}</span>
            </div>
            <div class="df-field-container">
                ${fieldHtml}
            </div>
        `;
    }

    getLabelTemplate(field: FormField) {
        const requiredTemplate = field.required ? `<span class="required"></span>` : '';
        const tooltipTemplate = utils.isBlank(field.tooltip) ? '' : `<span class="df-tooltip">?<span class="tooltip">${field.tooltip}</span></span>`;

        return `${field.label} ${tooltipTemplate} ${requiredTemplate}`;
    }

    /**
     * 그룹 템플릿
     *
     * @param {FormField} field
     * @returns {*}
     */
    groupTemplate(field: FormField) {
        const childTemplae = [];

        let viewStyleClass = '';
        let childLabelWidth = '';
        let isHorizontal = false;
        if (field.viewMode === 'vertical') {
            viewStyleClass = 'vertical';
        } else {
            if (field.viewMode === "horizontal-row") {
                childLabelWidth = field.childLabelWidth ? `width:${field.childLabelWidth};` : '';
                viewStyleClass = 'horizontal-row';
            } else {
                isHorizontal = true;
                viewStyleClass = 'horizontal';
            }
        }

        childTemplae.push(`<ul class="sub-field-group ${viewStyleClass}">`);

        for (const childField of field.children) {
            let childTempate = '';
            if (childField.children) {
                childTempate = this.groupTemplate(childField);
            } else {
                if (this.checkHiddenField(childField)) {
                    continue;
                }

                childTempate = this.getFieldTempate(childField);
            }

            if (isHorizontal) {
                childLabelWidth = childField.labelWidth ? `width:${childField.labelWidth};` : '';
            }

            childTemplae.push(`<li class="sub-row" id="${childField.$key}">
                ${childField.hideLabel ? '' : `<span class="sub-label" style="${childLabelWidth}">${this.getLabelTemplate(childField)}</span>`}
                <span class="df-field-container">${childTempate}</span>
            </li>`
            );

        }
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

        if (!utils.isBlank(field.name) && this.fieldInfoMap.hasFieldName(field.name)) {
            throw new Error(`Duplicate field name "${field.name}"`)
        }

        this.addRowFieldInfo(field);

        return (field.$renderer as any).template(field);
    }

    checkHiddenField(field: FormField) {
        const isHidden = utils.isHiddenField(field);

        if (isHidden) {
            this.fieldInfoMap.addField(field);
            field.$renderer = new (field.$renderer as any)(field, null, this);

            return true;
        }

        return false;
    }

    /**
     * add row file map
     *
     * @param {FormField} field
     */
    addRowFieldInfo(field: FormField) {
        utils.replaceXssField(field);
        this.fieldInfoMap.addField(field);
        this.addRowFields.push(field.$key);
    }

    /**
     * 폼 데이터 reset
     */
    resetForm = () => {
        const fieldMap = this.fieldInfoMap.getAllFieldInfo();
        for (const seq in fieldMap) {
            const filedInfo = fieldMap[seq];
            const renderInfo = filedInfo.$renderer;

            if (renderInfo && typeof renderInfo.reset === 'function') {
                renderInfo.reset();
            }
        }
        this.conditionCheck();
    }

    /**
     * field 값 reset
     * @param fieldName 필드명
     */
    resetField = (fieldName: string) => {
        this.fieldInfoMap.getFieldName(fieldName).$renderer.reset();
        this.conditionCheck();
    }

    /**
     * 필드 element 얻기
     *
     * @param {string} fieldName
     * @returns {*}
     */
    getFieldElement(fieldName: string) {
        const field = this.fieldInfoMap.getFieldName(fieldName);

        if (field?.$renderer) {
            return field.$renderer.getElement();
        }

        return null;
    }

    getField(fieldName: string): FormField {
        return this.fieldInfoMap.getFieldName(fieldName);
    }

    /**
     * field 값 얻기
     * 
     * @param fieldName  필드명
     * @returns 
     */
    getFieldValue = (fieldName: string) => {

        const field = this.fieldInfoMap.getFieldName(fieldName);

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
        return this.fieldInfoMap.getAllFieldValue(isValid);
    }

    getFormDataValue = (isValid: boolean): any => {
        return this.fieldInfoMap.getFormDataValue(isValid);
    }

    /**
     * 폼 필드 value 셋팅
     * @param values 
     */
    setValue = (values: any) => {
        Object.keys(values).forEach((fieldName) => {
            const value = values[fieldName];
            const filedInfo = this.fieldInfoMap.getFieldName(fieldName);
            console.log(fieldName)

            if (filedInfo) {
                const renderInfo = filedInfo.$renderer;
                renderInfo.setValue(value);
            }
        })
        this.conditionCheck();
    }

    setFieldValue = (fieldName: string, values: any) => {
        const value = {} as any;
        value[fieldName] = values;
        this.setValue(value);
    }

    setFieldItems = (fieldName: string, values: any) => {

        const field = this.fieldInfoMap.getFieldName(fieldName);

        if (field) {
            return field.$renderer.setValueItems(values);
        }
    }

    /**
     * field 추가
     *
     * @param {FormField} field
     */
    addField = (field: FormField) => {
        this.options.fields.push(field);
        this.addRow(field);
        this.conditionCheck();
    }

    /**
     * field 제거
     *
     * @param {string} fieldName
     */
    removeField = (fieldName: string) => {
        const element = this.getFieldElement(fieldName);

        if (element != null) {
            element.closest('.df-row')?.remove();

            this.fieldInfoMap.removeFieldInfo(fieldName);
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
        let firstFlag = this.options.autoFocus !== false ? true : false;

        const fieldMap = this.fieldInfoMap.getAllFieldInfo();
        for (const fieldKey in fieldMap) {
            const filedInfo = fieldMap[fieldKey];
            const renderInfo = filedInfo.$renderer;

            let fieldValid = renderInfo.valid();

            if (fieldValid !== true) {
                if (firstFlag) {
                    renderInfo.focus();
                    firstFlag = false;
                }
                validResult.push(fieldValid);
            }
        }

        return validResult;
    }

    isValidField = (fieldName: string): boolean => {
        const filedInfo = this.fieldInfoMap.getFieldName(fieldName);

        if (typeof filedInfo === 'undefined') {
            throw new Error(`Field name [${fieldName}] not found`);
        }

        const renderInfo = filedInfo.$renderer;
        if (renderInfo) {
            return renderInfo.valid() === true ? true : false;
        }

        return true;
    }

    getOptions = () => {
        return this.options;
    }

    conditionCheck() {
        this.fieldInfoMap.conditionCheck();
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

