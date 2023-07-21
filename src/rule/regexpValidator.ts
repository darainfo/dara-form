import { FormField } from "@t/FormField";
import { ValidResult } from "@t/ValidResult";


const regexp = {
    'mobile': /^\d{3}-\d{3,4}-\d{4}$/
    , 'email': /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    , 'url': /^(?:(?:https?|HTTPS?|ftp|FTP):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]-*)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/
    , 'number': /\d$/
    , 'alpha': /^[a-zA-Z]+$/
    , 'alpha-num': /^[a-zA-Z0-9]+$/
    , 'variable': /^[a-zA-Z0-9_$][a-zA-Z0-9_$]*$/
    , 'number-char': /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]/
    , 'upper-char': /^(?=.*?[A-Z])(?=.*?[a-z])/
    , 'upper-char-special': /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[#?!@$%^&*-])/
    , 'upper-char-special-number': /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/
};

export const regexpValidator = (value: string, field: FormField, result: ValidResult | undefined): ValidResult => {
    if (typeof result === 'undefined') {
        result = { name: field.name, constraint: [] };
    }

    const regexpType = field.regexpType;
    if (regexpType) {
        if (!regexp[regexpType].test(value)) {
            result.regexp = regexpType;
            return result;
        }

    }

    return result;
}