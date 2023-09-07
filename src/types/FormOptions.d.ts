import { TEXT_ALIGN_TYPE } from "src/constants";

/**
 * form options
 *
 * @export
 * @interface FormOptions
 * @typedef {FormOptions}
 */
export interface FormOptions {
  style: {
    width: string;
    labelWidth: string | number;
    valueWidth: string | number;
    position: string;
  };
  autoFocus: boolean; //  default true
  notValidMessage: string; //'This value is not valid'
  message: {
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
  fields: array;
}
