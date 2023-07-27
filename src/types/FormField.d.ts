import { FORM_FIELD_TYPE, RENDER_TYPE, REGEXP_TYPE } from "src/constants";
import Render from "src/renderer/Render";

export interface OptionCallback {
    (...params: any[]): any;
}

export interface CodeValue {
    label: string
    , value: string
    , selected: boolean
}

export interface FielInfo {
    fileId: string
    , fileName: string
    , fileSize: number
    , $seq: number
    , lastModified?: any
}

export interface ConditionInfo {
    show: boolean,
    field: string,
    eq: any,
    custom?: OptionCallback
}

export interface FormField {
    label: string // '아이디'
    , hideLabel: boolean
    , labelWidth: string
    , childLabelWidth: string
    , tooltip: string
    , description: string
    , example: string
    , viewMode: string //'horizontal' // horizontal , vertical, horizontal-row /   // radio, checkbox, group
    , name: string // 'uid'
    , style: string
    , type: FORM_FIELD_TYPE
    , renderType?: RENDER_TYPE | string
    , required?: boolean //true
    , regexpType?: REGEXP_TYPE
    , rule: {
        minLength: number // 3
        , maxLength: number //100
        , minimum: number
        , exclusiveMinimum: booealn
        , maximum: number
        , exclusiveMaximum: booealn
    }
    , template: OptionCallback | string
    , defaultValue: string
    , values: any[]
    , children: FormField[]
    , validator?: OptionCallback
    , onChange: OptionCallback
    , onClick: OptionCallback
    , renderer: Render
    , conditional: ConditionInfo
    , $renderer: Render
    , $xssName: string
    , $type: string
    , $key: string
    , $value: string
}