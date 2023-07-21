import { FormOptions } from '@t/FormOptions';
import { FormField } from '@t/FormField';
import { Message } from '@t/Message';
export default class DaraForm {
    private readonly options;
    private isHorizontal;
    private formElement;
    private allFieldInfo;
    private addRowFields;
    constructor(selector: string, options: FormOptions, message: Message);
    static setMessage(message: Message): void;
    createForm(fields: FormField[]): void;
    /**
     * field row 추가.
     *
     * @param field
     */
    addRow(field: FormField): void;
    rowTemplate(field: FormField): string;
    /**
     * 그룹 템플릿
     *
     * @param {FormField} field
     * @returns {*}
     */
    groupTemplate(field: FormField): string;
    /**
     * field tempalte 구하기
     *
     * @param {FormField} field
     * @returns {string}
     */
    getFieldTempate(field: FormField): string;
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
    /**
     * 폼 필드 value 셋팅
     * @param values
     */
    setValue: (values: any) => void;
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
    isValidField: (fieldName: string) => boolean;
    getOptions: () => FormOptions;
}
