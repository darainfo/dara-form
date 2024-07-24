import { FORM_MODE, TEXT_ALIGN_TYPE } from "src/constants";
import { OptionCallback } from "./FormField";

/**
 * form options
 *
 * @export
 * @interface FormOptions
 * @typedef {FormOptions}
 */
export interface FormOptions {
  /**
   * style 옵션
   *
   * @example
   * ```
   * width: '600px',
      position: 'left',
      labelWidth: '3'
      valueWidth: '9'
   * ```
   */
  style: {
    /**
     * form width
     * @example
     * 600px, 100em
     */
    width: string;
    /**
     * field label width
     * @example
     * bootstrap width 참고 (1 ~ 12) 또는 '600px'
     */
    labelWidth: string | number;
    /**
     * field value width
     * @example
     * bootstrap width 참고 (1 ~ 12) 또는 '600px'
     */
    valueWidth: string | number;
    /**
     * field label position
     * @example
     * "top" | "left" | "left-left" | "left-right" | "right" | "right-left" | "right-right" | "bottom"
     */
    position: string;
  };

  /**
   * form 자동 생성 여부
   * @default true
   * @example
   * true or false
   */
  autoCreate?: boolean;
  /**
   * field 자동 포커스
   * @default true
   * @example
   * true or false
   */
  autoFocus?: boolean; //  default true
  notValidMessage?: string; //'This value is not valid'
  onMounted?: OptionCallback;
  mode?: FORM_MODE;
  message?: {
    required: string; // '{name} 필수 입력사항입니다.'
    string: {
      minLength: string; //'{size} 글자 이상 입력해야합니다.'
      maxLength: string; //'{size} 글자 이상 입력할 수 없습니다.'
    };
    number: {
      min: string; //'{size} 보다 커야 합니다'
      max: string; //'{size} 보다 커야 합니다'
    };
    type: {
      message: string; // '{type} 유효하지 않습니다.'
    };
  };
  fields: any[];
}
