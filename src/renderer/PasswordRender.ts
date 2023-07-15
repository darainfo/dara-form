import { FormField } from "@t/FormField";
import { Render } from "./Render";
import { stringValidator } from "src/rule/stringValidator";
import XssUtil from "src/util/util";

export default class PasswordRender implements Render {
    private element:HTMLInputElement;
    private rowElement:HTMLElement;
    private field;

    constructor(field: FormField, rowElement: HTMLElement) {
        this.field = field;
        this.rowElement = rowElement; 
        this.element = rowElement.querySelector(`[name="${field.$xssName}"]`) as HTMLInputElement;
    }

    static template(field: FormField): string {
        return `<input type="password" name="${field.name}" class="form-field password" />`;
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
        // TODO password 관련 사항 처리 할것. 
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