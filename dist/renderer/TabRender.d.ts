import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
import FormTemplate from "src/FormTemplate";
import { FormOptions } from "@t/FormOptions";
export default class TabRender extends Render {
    private tabContainerElement;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    /**
     * tab item click
     *
     * @param {Element} tabItem
     * @param {*} evt
     */
    private clickEventHandler;
    setActive(tabId: string): void;
    static isDataRender(): boolean;
    /**
     * tab template
     *
     * @param {FormField} field
     * @param {FormTemplate} formTemplate
     * @param {FormOptions} options
     * @returns {string} template string
     */
    static template(field: FormField, formTemplate: FormTemplate, options: FormOptions): string;
    getValue(): string;
    setValue(value: any): void;
    reset(): void;
    getElement(): Element;
    valid(): any;
}
