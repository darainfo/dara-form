import { FielInfo, FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class FileRender extends Render {
    private element;
    private field;
    private removeIds;
    private uploadFiles;
    private fileList;
    private fileSeq;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
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
