import { FielInfo, FormField } from "@t/FormField";
import Render from "./Render";
export default class FileRender implements Render {
    private element;
    private rowElement;
    private field;
    private removeIds;
    private uploadFiles;
    private fileList;
    private fileSeq;
    constructor(field: FormField, rowElement: HTMLElement);
    initEvent(): void;
    addFiles(files: FileList): void;
    setFileList(fileList: FielInfo[]): void;
    static template(field: FormField): string;
    getValue(): {
        uploadFile: unknown[];
        removeIds: any[];
    };
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLInputElement;
    valid(): any;
}
