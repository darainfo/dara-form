import { FormField } from "@t/FormField";
import { Render } from "./Render";
import XssUtil from "src/util/util";
import { stringValidator } from "src/rule/stringValidator";

export default class TextAreaRender implements Render {
    private element:HTMLTextAreaElement ;
    private rowElement:HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement;
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLTextAreaElement;
    }

    static template(field: FormField): string {
        return `<textarea name="${field.name}" class="form-field textarea"></textarea>`;
    }

    getValue() {
        return this.element.value;
    }

    setValue(value: any): void {
        this.element.value = value;
    }

    reset() {
        this.element.value = '';
    }

    getElement(): HTMLElement {
        return this.element;
    }

    valid(): any {

        const validResult = stringValidator(this.getValue(), this.field);

        if(validResult===true){
            if(this.element.classList.contains('invalid')){
                this.element.classList.remove('invalid');
            }
        }else{
            if(!this.element.classList.contains('invalid')){
                this.element.classList.add('invalid')
            }
        }
        
        return validResult;
    }

}