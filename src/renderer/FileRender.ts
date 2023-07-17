import { FormField } from "@t/FormField";
import Render from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import { resetRowElementStyleClass, setInvalidMessage } from "src/util/validUtil";
import { fileValidator } from "src/rule/fileValidator";
import { fileChangeEvent } from "src/util/renderEvents";

export default class FileRender implements Render {
  private element: HTMLInputElement;
  private rowElement: Element;
  private field;
  private removeFileIds: any[] = [];
  private uploadFiles: any[] = [];
  private fileList: any[] = [];

  constructor(field: FormField, rowElement: HTMLElement) {
    this.field = field;
    this.rowElement = rowElement;
    this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    this.initEvent();
  }

  initEvent() {
    fileChangeEvent(this.element, this);
  }

  static template(field: FormField): string {
    return `<input type="file" name="${field.name}" class="form-field file" multiple/>`;
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
    const validResult = fileValidator(this.element, this.field);

    setInvalidMessage(this.field, this.rowElement, validResult);

    return validResult;
  }
}
