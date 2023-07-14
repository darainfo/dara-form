import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";

export interface Render {
    getValue(): any;
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): ValidResult | boolean;
}