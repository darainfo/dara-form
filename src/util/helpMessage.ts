import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";
import Lanauage from "./Lanauage";

export const helpMessage = (field: FormField, rowElement: Element, validResult: ValidResult | boolean) => {
  if (validResult === true) {
    if (rowElement.classList.contains("invalid")) {
      rowElement.classList.remove("invalid");
    }

    if (!rowElement.classList.contains("valid")) {
      rowElement.classList.add("valid");
    }

    const helpMessageElement = rowElement.querySelector(".help-message");
    if (helpMessageElement) {
      helpMessageElement.innerHTML = "";
    }
  } else {
    if (!rowElement.classList.contains("invalid")) {
      rowElement.classList.add("invalid");
    }

    if (validResult !== false) {
      const message: string[] = Lanauage.validMessage(field, validResult);

      const helpMessageElement = rowElement.querySelector(".help-message");
      if (helpMessageElement && message.length > 0) {
        const msgHtml: string[] = [];
        message.forEach((item) => {
          msgHtml.push(`<div>${item}</div>`);
        });
        helpMessageElement.innerHTML = msgHtml.join("");
      }
    }
  }
};
