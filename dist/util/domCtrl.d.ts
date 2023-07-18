export declare const $dom: (el: Element | string) => DaraElement;
export declare class DaraElement {
    private readonly element;
    private eventMap;
    constructor(el: Element | string);
    /**
     * before 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    before(renderElements: Element | string): this;
    /**
     * after 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    after(renderElements: Element | string): this;
    /**
     * element 안에 가장 첫번째 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    prepend(renderElements: Element | string): this;
    /**
     * element 안에 가장 마지막 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    append(renderElements: Element | string): this;
    empty(): this;
    eventOff: (type: string, listener?: any, options?: any) => this;
    eventOn: (type: string, listener: any, selector?: string) => this;
    /**
     * 상위 element
     *
     * @public
     * @param {string} selector
     * @returns {*}
     */
    closest(selector: string): Element | null;
    /**
     * class 추가
     *
     * @public
     * @param {...string[]} classes
     * @returns {this}
     */
    addClass(...classes: string[]): this;
    /**
     * class 체크
     *
     * @public
     * @param {string} cls
     * @returns {boolean}
     */
    hasClass(cls: string): boolean;
}
