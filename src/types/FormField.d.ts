import { FORM_FIELD_TYPE, RENDER_TYPE, REGEXP_TYPE } from "src/constants";
import Render from "src/renderer/Render";

export interface OptionCallback {
    (...params: any[]): any;
}

/**
 * radio , checkbox, dropdown 값 
 *
 * @export
 * @interface CodeValue
 * @typedef {CodeValue}
 */
export interface CodeValue {
    label: string
    , value: string
    , selected: boolean
}

/**
 * 첨부 파일 정보
 *
 * @export
 * @interface FielInfo
 * @typedef {FielInfo}
 */
export interface FielInfo {
    fileId: string
    , fileName: string
    , fileSize: number
    , $seq: number
    , lastModified?: any
}

/**
 * 상태 체크 정보
 *
 * @export
 * @interface ConditionInfo
 * @typedef {ConditionInfo}
 */
export interface ConditionInfo {
    show: boolean,
    field: string,
    eq: any,
    custom?: OptionCallback
}

/**
 * form field
 *
 * @export
 * @interface FormField
 * @typedef {FormField}
 */
export interface FormField {
    name: string // 'uid'
    , type: FORM_FIELD_TYPE
    , renderType?: RENDER_TYPE | string
    , label: string // '아이디'
    , hideLabel: boolean    // label 보이기 여부
    , labelWidth: string        // label 넓이
    , childLabelWidth: string   // child label 넓이
    , tooltip: string               // 툴팁 문구
    , description: string       // 설명
    , placeholder: string       // input , textarea 문구
    , viewMode: string //'horizontal' // horizontal , vertical, horizontal-row /   // radio, checkbox, group
    , required?: boolean //true // 필요 여부
    , regexpType?: REGEXP_TYPE  // 정규식 타입
    , rule: {                                  // 규칙
        minLength: number // 3      
        , maxLength: number //100
        , minimum: number
        , exclusiveMinimum: booealn
        , maximum: number
        , exclusiveMaximum: booealn
    }
    , different: {      // field 값이 다른지 비교
        field: string
        , message: string
    }
    , identical: {      // field 값이 같은지 비교
        field: string
        , message: string
    }
    , template: OptionCallback | string     // 필드 템플릿
    , defaultValue: string              // 기본값
    , values: any[]                     // dropdown, radio, checkbox
    , children: FormField[]         // child field
    , validator?: OptionCallback    // custom validator
    , onChange: OptionCallback  //  입력값 변경시 체크 function
    , onClick: OptionCallback       // button onclick function   
    , renderer: Render                  // custom renderer
    , conditional: ConditionInfo   // 보이기 여부
    , $renderer: Render                 // 실제 render
    , $xssName: string                  // xss 변경명
    , $key: string                          // 내부 key
    , $value: string                        // 내부 사용 value
}