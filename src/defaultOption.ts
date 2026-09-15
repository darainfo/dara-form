import { FormOptions } from "./types/FormOptions";
import { merge } from "./util/utils";

export function initFormOptions(options: FormOptions): FormOptions {
  const opts = merge({}, DEFAULT_OPTIONS, options) as FormOptions;

  return opts;
}

/**
 * 전역으로 옵션 설정.
 *
 * @param options 옵션
 */
export function setDefaultOptions(options: Partial<FormOptions>): void {
  DEFAULT_OPTIONS = merge({}, DEFAULT_OPTIONS, options);
}

let DEFAULT_OPTIONS = {
  style: {
    width: "100%",
    labelWidth: 3,
    valueWidth: 9,
    position: "left-right",
  },
  mode: "new",
  useTypeValue: true,
  autoCreate: true,
  notValidMessage: "This form is not valid.",
  fields: [],
} as FormOptions;
