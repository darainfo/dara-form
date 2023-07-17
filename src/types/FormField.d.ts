import { FORM_FIELD_TYPE, RENDER_TYPE, VALIDATORS } from "src/constants";

interface OptionCallback {
    (loaderOpt: object): any;
}

interface CodeValue {
    label: string
    , value: string
    , selected: boolean
}

export interface FormField {
    label: string // '아이디'
    , viewMode: string //'horizontal' // horizontal , vertical /   // radio, checkbox, group
    , name: string // 'uid'
    , type: FORM_FIELD_TYPE
    , renderType: RENDER_TYPE | string
    , required: boolean //true
    , validator: VALIDATORS
    , rule: {
        minLength: number // 3
        , maxLength: number //100
        , min: number
        , max: number
    }
    , message: string
    , template: OptionCallback | string
    , value: CodeValue[]
    , childen: FormField[]
    , callback: {
        message: string // '이미 존재하는 아이디 입니다.',
        callback: OptionCallback
    }
    , renderer: Render
    , $isCustomRenderer: boolean
    , $xssName: string
    , $type: string
}