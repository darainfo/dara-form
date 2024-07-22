import { FormField } from "@t/FormField";
import Render from "src/renderer/Render";
import * as utils from "src/util/utils";

export const inputEvent = (field: FormField, element: Element, renderInfo: Render) => {
  element.addEventListener("input", (e: Event) => {
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });
};

export const numberInputEvent = (field: FormField, element: HTMLInputElement, renderInfo: Render) => {
  element.addEventListener("keyup", (e: any) => {
    const val = e.target.value;

    if (!utils.isNumber(val)) {
      element.value = val.replace(/[^0-9\.\-\+]/g, "");
      e.preventDefault();
    }
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });

  /*
    element.addEventListener('input', (e: any) => {
        customChangeEventCall(field, e, renderInfo);
        renderInfo.valid();
    })
    */
};

export const dropdownChangeEvent = (field: FormField, element: Element, renderInfo: Render) => {
  element.addEventListener("change", (e: Event) => {
    customChangeEventCall(field, e, renderInfo);
    renderInfo.valid();
  });
};

export const customChangeEventCall = (field: FormField, e: Event, renderInfo: Render) => {
  renderInfo.changeEventCall(field, e, renderInfo);
};
