import { Message } from "@t/Message";
import { FormField } from "../types/FormField";
import { ValidResult } from "@t/ValidResult";
declare class Language {
    private lang;
    set(lang?: Message): void;
    validMessage(field: FormField, validResult: ValidResult): string[];
}
declare const _default: Language;
export default _default;
