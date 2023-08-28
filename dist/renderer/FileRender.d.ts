import { FormField } from "@t/FormField";
import Render from "./Render";
import DaraForm from "src/DaraForm";
export default class FileRender extends Render {
    private element;
    private removeIds;
    private uploadFiles;
    private fileList;
    private fileSeq;
    constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm);
    initEvent(): void;
    addFiles(files: FileList): void;
    private setFileList;
    /**
     * 파일 다운로드 이벤트 처리.
     *
     * @param item
     * @param fileListElement
     */
    private downloadFileEvent;
    /**
     * 파일 삭제  처리.
     *
     * @param item
     * @param fileListElement
     */
    private removeFileEvent;
    static template(field: FormField): string;
    getValue(): {
        uploadFile: unknown[];
        removeIds: any[];
    };
    setValueItems(value: any): void;
    setValue(value: any): void;
    reset(): void;
    getElement(): HTMLInputElement;
    valid(): any;
}
