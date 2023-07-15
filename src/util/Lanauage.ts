import { Message } from "@t/Message";
import { FormField } from "../types/FormField";
import { ValidResult } from "@t/ValidResult";
import { RULES } from "src/constants";

let localeMessage: Message = {
  required: "{label} 필수 입력사항입니다.",
  string: {
    minLength: "{minLength} 글자 이상으로 입력하세요.",
    maxLength: "{maxLength} 글자 이하로 입력하세요.",
    between: "{minLength} ~ {maxLength} 사이의 글자를 입력하세요.",
  },
  number: {
    min: "{min} 보다 커야 합니다",
    max: "{max} 보다 커야 합니다",
    between: "{min}~{max} 사이의 숫자를 입력하세요.",
  },
  validator: {
    email: "이메일이 유효하지 않습니다.",
    url: "URL이 유효하지 않습니다.",
    alpha: "영문만 입력가능합니다.",
    alphaNum: "영문과 숫자만 입력가능힙니다.",
  },
};

class Language {
  private lang: Message = localeMessage;

  public set(lang?: Message) {
    this.lang = Object.assign({}, localeMessage, lang);
  }

  public validMessage(field: FormField, validResult: ValidResult):string[] {
    let messageFormat = "";

    let messageFormats:string[] = [];

    validResult.constraint.forEach(constraint=>{
        if (constraint === RULES.REQUIRED) {
            messageFormat = message(this.lang.required, field);
            messageFormats.push(messageFormat);
         }
      
          
        if (field.validator) {
            messageFormat = (this.lang.validator as any)[constraint];
            messageFormats.push(messageFormat);
        }
    
        if (field.type == "number") {
            messageFormat = (this.lang.number as any)[constraint];
            messageFormats.push(messageFormat);
        }else{
            messageFormat = (this.lang.string as any)[constraint];
            messageFormats.push(messageFormat);
            
        }
          
    })

    const reMessage:string[] = [];

    const msgParam = Object.assign({},{name : field.name, label : field.label}, field.rule);
    messageFormats.forEach(msgFormat=>{
        if(msgFormat){
            
            reMessage.push(message(msgFormat, msgParam));
        }  
    })

    return reMessage;

    
  }
}

function message(msgFormat: string, msgParam: any): string {
  return msgFormat.replace(/\{{1,1}([A-Za-z0-9_.]*)\}{1,1}/g, (match, key) => {
    return typeof msgParam[key] !== "undefined" ? msgParam[key] : match;
  });
}

export default new Language();
