import { FielInfo, FormField } from "@t/FormField";
import Render from "./Render";
import { resetRowElementStyleClass, setInvalidMessage } from "src/util/validUtil";
import { fileValidator } from "src/rule/fileValidator";

export default class FileRender implements Render {
  private element: HTMLInputElement;
  private rowElement: Element;
  private field;
  private removeFileIds: any[] = [];
  private uploadFiles: any = {};
  private fileList: any[] = [];
  private fileSeq = 0;

  constructor(field: FormField, rowElement: HTMLElement) {
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
      this.valid();
    })

    this.fileList.map(file => {
      file.$seq = this.fileSeq += 1;
    })

    this.setFileList(this.fileList);
  }

  addFiles(files: FileList) {
    let addFlag = false;
    for (let i = 0; i < files.length; i++) {
      const item = files[i];

      const fileCheckList = this.fileList.filter(fileItem => fileItem.fileName == item.name && fileItem.fileSize == item.size && fileItem.lastModified == item.lastModified);

      if (fileCheckList.length > 0) continue;
      this.fileSeq += 1;
      this.uploadFiles[this.fileSeq] = item;

      this.fileList.push({
        fileName: item.name
        , $seq: this.fileSeq
        , fileSize: item.size
        , lastModified: item.lastModified
      });
      addFlag = true;
    }

    this.setFileList(this.fileList);
  }

  setFileList(fileList: FielInfo[]) {
    const fileListElement = this.rowElement.querySelector('.dara-file-list');
    if (fileListElement) {
      fileListElement.innerHTML = `${fileList.map(file => `
        <div class="file-item" data-seq="${file.$seq}">
          <span class="file-icon">
            ${file.fileId ? '<span class="download"></span>' : ''} <span class="remove">X</span>
          </span>
          <span class="file-name">${file.fileName}</span > 
        </div>
      `).join('')}`;

      [].forEach.call(fileListElement.querySelectorAll(".remove"), (ele: Element) => {

        ele.addEventListener('click', (evt: Event) => {
          const targetEle = evt.target as Element;

          const fileItemElement = targetEle.closest('.file-item');

          if (fileItemElement) {
            const attrSeq = fileItemElement.getAttribute("data-seq");
            if (attrSeq) {
              const seq = parseInt(attrSeq, 10);
              const removeIdx = this.fileList.findIndex(v => v.$seq === seq);

              const removeItem = this.fileList[removeIdx];

              this.fileList.splice(removeIdx, 1);
              delete this.uploadFiles[seq];
              fileItemElement.remove();

              this.removeFileIds.push(removeItem.fileId)
            }
          }
          this.valid();
        })
      })
    }
  }



  static template(field: FormField): string {
    return `
    <span class="dara-form-field">
      <span class="file-wrapper">
        <label class="file-label"><input type="file" name="${field.name}" class="form-field file" multiple />File</label>
        <i class="help-icon"></i>
      </span>
    </span>
    <div class="dara-file-list"></div>
    `;
  }

  getValue() {
    const files: any[] = [];

    const filelist = this.element.files;
    if (filelist && filelist?.length > 0) {
      for (const file of filelist) {
        files.push(file);
      }
    }
    return files.length > 0 ? files : null;
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

    setInvalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
