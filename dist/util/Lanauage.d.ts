import { Message } from "@t/Message";
import { FormField } from "../types/FormField";
import { ValidResult } from "@t/ValidResult";
/**
 * validation 메시지 처리.
 *
 * @class Language
 * @typedef {Language}
 */
declare class Language {
    private lang;
    /**
     * 다국어 메시지 등록
     *
     * @public
     * @param {?Message} [lang] 둥록할 메시지
     */
    set(lang?: Message): void;
    /**
     * 메시지 얻기
     *
     * @public
     * @param {string} messageKey 메시지 키
     * @returns {*}
     */
    getMessage(messageKey: string): any;
    /**
     * ValidResult 값을 메시지로 변경.
     *
     * @public
     * @param {FormField} field
     * @param {ValidResult} validResult
     * @returns {string[]}
     */
    validMessage(field: FormField, validResult: ValidResult): string[];
}
declare const _default: Language;
export default _default;
