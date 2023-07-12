/**
 * form options
 *
 * @export
 * @interface FormOptions
 * @typedef {FormOptions}
 */
export interface FormOptions {
    mode: string //'horizontal' // horizontal , vertical // 가로 세로 모드
    , width: string //'100%'
    , labelWidth: string// '20%'
    , notValidMessage: string//'This value is not valid'
    , message: {
        empty: string // '{name} 필수 입력사항입니다.'
        , "string": {
            minLength: string //'{size} 글자 이상 입력해야합니다.'
            , maxLength: string  //'{size} 글자 이상 입력할 수 없습니다.'
        }
        , "number": {
            min: string //'{size} 보다 커야 합니다'
            , min: string //'{size} 보다 커야 합니다'
        }
        , "type": {
            email: string // '이메일이 유효하지 않습니다.'
            , url: string // 'URL이 유효하지 않습니다.'
        }
    }
    , fields: array
}
