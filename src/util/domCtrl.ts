import { DataMap } from "@t/DataMap";
import utils from './util';

const instanceMap = new Map();

export const $dom = (el: Element | string): DaraElement => {
    if (instanceMap.get(el)) {
        return instanceMap.get(el);
    }

    return new DaraElement(el);
}

export class DaraElement {

    private readonly element: Element;

    private eventMap: DataMap = {};

    constructor(el: Element | string) {
        this.element = $querySelector(el);
        instanceMap.set(el, this);
    }

    /**
     * before 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    public before(renderElements: Element | string) {
        insertAdjacentHTML(this.element, 'beforebegin', renderElements);
        return this;
    }

    /**
     * after 추가. 
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    public after(renderElements: Element | string) {
        insertAdjacentHTML(this.element, 'afterend', renderElements);
        return this;
    }

    /**
     * element 안에 가장 첫번째 추가. 
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    public prepend(renderElements: Element | string) {
        insertAdjacentHTML(this.element, 'afterbegin', renderElements);
        return this;
    }

    /**
     * element 안에 가장 마지막 추가.
     *
     * @public
     * @param {(Element | string)} renderElements
     * @returns {this}
     */
    public append(renderElements: Element | string) {
        insertAdjacentHTML(this.element, 'beforeend', renderElements);
        return this;
    }

    public empty() {
        this.element.innerHTML = '';
        return this;
    }

    public eventOff = (type: string, listener?: any, options?: any) => {
        let fn = listener;
        if (!utils.isFunction(listener)) {
            fn = returnFalse;
        }

        if (this.eventMap[type]) {
            this.element.removeEventListener(type, this.eventMap[type]);
        } else if (options) {
            this.element.removeEventListener(type, fn, options);
        } else {
            this.element.removeEventListener(type, fn);
        }

        return this;
    }

    public eventOn = (type: string, listener: any, selector?: string) => {
        this.eventMap[type] = listener;
        if (utils.isUndefined(selector)) {
            this.element.addEventListener(type, listener);

            return this;
        }

        const fn = (e: any) => {
            const evtTarget = e.target as Element;

            const selectorEle = evtTarget.closest(selector);

            if (selectorEle) {
                listener(e);
            }
        };

        this.eventMap[type] = fn;
        this.element.addEventListener(type, fn);

        return this;
    }

    /**
     * 상위 element
     *
     * @public
     * @param {string} selector
     * @returns {*}
     */
    public closest(selector: string) {
        return this.element.closest(selector);
    }

    /**
     * class 추가
     *
     * @public
     * @param {...string[]} classes
     * @returns {this}
     */
    public addClass(...classes: string[]) {
        classes.forEach((cls) => {
            if (!this.element.classList.contains(cls)) {
                this.element.classList.add(cls);
            }
        })

        return this;
    }


    /**
     * class 체크 
     *
     * @public
     * @param {string} cls
     * @returns {boolean}
     */
    public hasClass(cls: string): boolean {
        return this.element.classList.contains(cls);
    }
}


function returnFalse() {
    return false;
}


function $querySelector(el: Element | string): Element {

    if (el instanceof Element) {
        return el;
    }
    return document.querySelector(el) as Element;
}

function insertAdjacentHTML(el: Element, insertPosition: InsertPosition, renderElements: Element | string) {

    if (utils.isString(renderElements)) {
        el.insertAdjacentHTML(insertPosition, renderElements)
    } else {
        el.insertAdjacentElement(insertPosition, renderElements)
    }
}