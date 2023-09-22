import { FormOptions } from "@t/FormOptions";
import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import { Message } from "@t/Message";
/**
 * DaraForm class
 *
 * @class DaraForm
 * @typedef {DaraForm}
 */
export default class DaraForm {
    private readonly options;
    private fieldInfoMap;
    private formValue;
    private addRowFields;
    private formTemplate;
    constructor(selector: string, options: FormOptions, message: Message);
    static setMessage(message: Message): void;
    createForm(fields: FormField[]): void;
    /**
     * 폼 데이터 reset
     */
    resetForm: () => void;
    /**
     * field 값 reset
     * @param fieldName 필드명
     */
    resetField: (fieldName: string) => void;
    /**
     * 필드 element 얻기
     *
     * @param {string} fieldName
     * @returns {*}
     */
    getFieldElement(fieldName: string): any;
    getField(fieldName: string): FormField;
    /**
     * field 값 얻기
     *
     * @param fieldName  필드명
     * @returns
     */
    getFieldValue: (fieldName: string) => any;
    /**
     * 폼 필드 값 얻기
     * @param isValid 폼 유효성 검사 여부 default:false|undefined true일경우 검사.
     * @returns
     */
    getValue: (isValid: boolean) => any;
    getFormDataValue: (isValid: boolean) => any;
    /**
     * 폼 필드 value 셋팅
     * @param values
     */
    setValue: (values: any) => void;
    setFieldValue: (fieldName: string, value: any) => void;
    private _setFieldValue;
    setFieldItems: (fieldName: string, values: any) => void;
    /**
     * field 추가
     *
     * @param {FormField} field
     */
    addField: (field: FormField) => void;
    /**
     * field 제거
     *
     * @param {string} fieldName
     */
    removeField: (fieldName: string) => void;
    /**
     * 폼 유효성 검증 여부
     *
     * @returns {boolean}
     */
    isValidForm: () => boolean;
    /**
     * 유효성 검증 폼 검증여부 리턴
     *
     * @returns {any[]}
     */
    validForm: () => any[];
    private validTabCheck;
    isValidField: (fieldName: string) => boolean;
    getOptions: () => FormOptions;
    conditionCheck(): void;
    setFieldDisabled(fieldName: string, flag: boolean): void;
    /**
     * 설명 추가
     *
     * @public
     * @param {string} fieldName
     * @param {string} desc
     */
    setFieldDescription(fieldName: string, desc: string): void;
    static validator: {
        string: (value: string, field: FormField) => boolean | ValidResult;
        number: (value: string, field: FormField) => boolean | ValidResult;
        regexp: (value: string, field: FormField) => ValidResult;
    };
}
