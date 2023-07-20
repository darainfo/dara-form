export interface Message {
  required: string; //'{name} 필수 입력사항입니다.'
  fileButton: string,
  string: {
    minLength: string; //'{size} 글자 이상으로 입력하세요.'
    maxLength: string; //'{size} 글자 이하로 입력하세요.'
    between: string; //'{min} ~ {max} 사이의 글자를 입력하세요.'
  };
  number: {
    min: string; //'{size} 보다 커야 합니다'
    max: string; //'{size} 보다 커야 합니다'
    between: string; // '{min}~{max} 사이의 숫자를 입력하세요.'
  };
  validator: { //'{type}이 유효하지 않습니다.'
    'mobile': string
    'email': string;
    'url': string;
    'number': string
    'alpha': string;
    'alpha-num': string;
    'variable': string;
  };
}
