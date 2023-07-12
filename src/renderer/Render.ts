import { FormField } from "@t/FormField";

export interface Render {
    getValue(): any;
    setValue(value: any): void;
}