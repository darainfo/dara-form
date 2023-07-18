import { FormField } from "@t/FormField";
import Render from "./Render";
export default class FileRender implements Render {
    private element;
    private rowElement;
    private field;
    private removeFileIds;
    private uploadFiles;
    private fileList;
    constructor(field: FormField, rowElement: HTMLElement);
    initEvent(): void;
    static template(field: FormField): string;
    getValue(): any[] | null;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLInputElement;
    valid(): any;
}
