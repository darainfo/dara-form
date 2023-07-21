import { ValidResult } from "@t/ValidResult";
export default interface Render {
    initEvent(): void;
    getValue(): any;
    setValue(value: any): void;
    reset(): void;
    getElement(): any;
    valid(): ValidResult | boolean;
}
