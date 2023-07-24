import { FielInfo, FormField } from "@t/FormField";
import Render from "./Render";
import { resetRowElementStyleClass, invalidMessage } from "src/util/validUtils";
import { fileValidator } from "src/rule/fileValidator";
import Lanauage from "src/util/Lanauage";
import { customChangeEventCall } from "src/event/renderEvents";
import DaraForm from "src/DaraForm";

export default class FileRender extends Render {
  private element: HTMLInputElement;
  private rowElement: Element;
  private field;
  private removeIds: any[] = [];
  private uploadFiles: any = {};
  private fileList: any[] = [];
  private fileSeq = 0;

  constructor(field: FormField, rowElement: HTMLElement, daraForm: DaraForm) {
    super(daraForm);

    this.field = field;
    this.rowElement = rowElement;
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.fileList = field.values;
    this.initEvent();

  }

  initEvent() {
    this.element.addEventListener('change', (e: Event) => {
      const files = (e.target as HTMLInputElement)?.files;

      if (files) {
        this.addFiles(files);
      }
      customChangeEventCall(this.field, e, this);
      this.valid();
    })

    this.fileList.forEach(file => {
      file.$seq = this.fileSeq += 1;
    })

    this.setFileList(this.fileList);
  }

  addFiles(files: FileList) {
    let addFlag = false;

    const newFiles: FielInfo[] = [];

    for (let item of files) {

      const fileCheckList = this.fileList.filter(fileItem => fileItem.fileName == item.name && fileItem.fileSize == item.size && fileItem.lastModified == item.lastModified);

      if (fileCheckList.length > 0) continue;
      this.fileSeq += 1;
      this.uploadFiles[this.fileSeq] = item;

      let newFileInfo = {
        fileName: item.name
        , $seq: this.fileSeq
        , fileSize: item.size
        , lastModified: item.lastModified
      } as FielInfo;

      newFiles.push(newFileInfo);
      addFlag = true;
    }
    if (addFlag) {
      this.setFileList(newFiles);
      this.fileList.push(...newFiles);
    }
  }

  setFileList(fileList: FielInfo[]) {
    const fileListElement = this.rowElement.querySelector('.dara-file-list');
    if (fileListElement) {
      const fileTemplateHtml: string[] = [];

      fileList.forEach(file => {
        fileTemplateHtml.push(`
        <div class="file-item" data-seq="${file.$seq}">
          ${file.fileId ? '<span class="file-icon download"></span>' : '<span class="file-icon"></span>'} <span class="file-icon remove"></span>
          <span class="file-name">${file.fileName}</span > 
        </div>`);
      })

      fileListElement.insertAdjacentHTML('beforeend', fileTemplateHtml.join(''));

      fileList.forEach(item => {
        const ele = fileListElement.querySelector(`[data-seq="${item.$seq}"] .remove`);
        if (ele) {
          ele.addEventListener('click', (evt: Event) => {
            const fileItemElement = (evt.target as Element).closest('.file-item');

            if (fileItemElement) {
              const attrSeq = fileItemElement.getAttribute("data-seq");
              if (attrSeq) {
                const seq = parseInt(attrSeq, 10);
                const removeIdx = this.fileList.findIndex(v => v.$seq === seq);

                const removeItem = this.fileList[removeIdx];

                this.fileList.splice(removeIdx, 1);
                delete this.uploadFiles[seq];
                fileItemElement.remove();

                if (removeItem.fileId) {
                  this.removeIds.push(removeItem.fileId)
                }
              }
            }
            this.valid();
          })
        }
      });
    }
  }

  static template(field: FormField): string {
    return `
    <div class="dara-form-field">
      <span class="file-wrapper">
        <label class="file-label"><input type="file" name="${field.name}" class="form-field file" multiple />${Lanauage.getMessage('fileButton')}</label>
        <i class="dara-icon help-icon"></i>
      </span>
    </div>
    <div class="dara-file-list"></div>
    <div class="help-message"></div>
    `;
  }

  getValue() {
    return {
      uploadFile: Object.values(this.uploadFiles)
      , removeIds: this.removeIds
    };
  }

  setValue(value: any): void {
    this.element.value = value;
  }

  reset() {
    this.setValue('');
    resetRowElementStyleClass(this.rowElement);
  }

  getElement(): HTMLInputElement {
    return this.element;
  }

  valid(): any {

    const validResult = fileValidator(this.element, this.field, this.fileList);

    invalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
