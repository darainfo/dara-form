import { FieldStyle, FormField } from "@t/FormField";
import FieldInfoMap from "src/FieldInfoMap";
import DaraForm from "./DaraForm";
/**
 * form template
 *
 * @class FormTemplate
 * @typedef {FormTemplate}
 */
export default class FormTemplate {
    private readonly options;
    private readonly formElement;
    private fieldInfoMap;
    private daraform;
    private addRowFields;
    constructor(daraform: DaraForm, formElement: Element, fieldInfoMap: FieldInfoMap);
    /**
     * field row 추가.
     *
     * @param field
     */
    addRow(field: FormField): void;
    /**
     * 그룹 템플릿
     *
     * @param {FormField} field
     * @returns {string} row template
     */
    rowTemplate(field: FormField): string;
    private getTemplate;
    childTemplate(field: FormField, parentFieldStyle: FieldStyle): string;
    /**
     * label template
     *
     * @param {FormField} field form field
     * @returns {string} template string
     */
    getLabelTemplate(field: FormField): string;
    /**
     * tab render type check
     *
     * @param {FormField} field
     * @returns {boolean} tab type 인지 여부
     */
    private isTabType;
    private tabTemplate;
    /**
     * label 숨김 여부
     *
     * @param field formfield
     * @returns
     */
    private isLabelHide;
    /**
     * field tempalte 구하기
     *
     * @param {FormField} field
     * @returns {string}
     */
    getFieldTempate(field: FormField): string;
    checkHiddenField(field: FormField): boolean;
    /**
     * add row file map
     *
     * @param {FormField} field
     */
    addRowFieldInfo(field: FormField): void;
}
