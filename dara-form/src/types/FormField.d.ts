interface OptionCallback {
    (loaderOpt: object): any;
}

interface value {
    label: string
    , value: string
    , selected: boolean
}

export type formFieldType = 'number' | 'string' | 'array';

export type renderType = 'number' | 'text' | 'textarea' | 'dropdown' | 'radio' | 'checkbox' | 'date' | 'group';

export interface FormField {
    label: string // '아이디'
    , viewMode: string //'horizontal' // horizontal , vertical /   // radio, checkbox, group
    , name: string // 'uid'
    , type: formFieldType
    , renderType: renderType | string
    , required: boolean //true
    , rule: {
        minLength: number // 3
        , maxLength: number //100
        , min: number
        , max: number
    }
    , template: OptionCallback | string
    , value: value[]
    , childen: FormField[]
    , callback: {
        message: string // '이미 존재하는 아이디 입니다.',
        callback: OptionCallback
    }
}