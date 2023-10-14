# DaraForm
JavaScript form creation library

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/darainfo/dara-form/blob/main/LICENSE)
[![npm version](https://badge.fury.io/js/dara-form.svg)](https://img.shields.io/npm/v/dara-form)
![npm](https://img.shields.io/npm/dt/dara-form)
[![minzipped size](https://img.shields.io/bundlephobia/minzip/dara-form)](https://bundlephobia.com/package/dara-form)


## Browser Support

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png)  
--- | --- | --- | --- | --- |  
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ |  


1. Install

```sh
yarn install
# OR
npm install
```

2. Run

```sh
npm start
```

3. Open `http://localhost:8889` in your browser


# 사용방법
```
const form = new DaraForm("#loginForm", {
    message: "This value is not valid",
     style: {
      position: 'top-left',
      labelWidth: '3'

    },
    // form load 이후 호출. 
    onMounted: function () {
      console.log(this)
    },
    message: {
      empty: "{name} 필수 입력사항입니다.",
      string: {
        minLength: "{size} 글자 이상 입력해야합니다.",
        maxLength: "{size} 글자 이상 입력할 수 없습니다.",
      },
      number: {
        minimum: "{size} 보다 커야 합니다",
        miximum: "{size} 보다 커야 합니다",
      },
      regexp: {
        email: "이메일이 유효하지 않습니다.",
        url: "URL이 유효하지 않습니다.",
      },
    },
    fields: [
      {
        name: "uid",
        label: "아이디",
        tooltip: "아이디를 넣어주세요.",
        placeholder: "아이디를 넣어주세요.",
        renderType: "text",
      }
      , {
        name: "password",
        label: "패스워드",
        description: "비밀번호는 대문자 소문자 포함입니다.",
        placeholder: "패스워드를 입력하세요",
        renderType: "password",
      }
    ]
  });
```
  

# Form 옵션
| key | 설명 | 기본값 | 옵션값 |
|-----|------|-----|-----|
| style |  width: form 넓이<br> labelWidth : label 넓이 <br> valueWidth : value width<br> position : '"[label위치]"-[글자 정렬위치]' <br> -- ex) 'top-left','left-right' |  width: "100%" <br>  labelWidth: 3<br> valueWidth: 9<br> position: "left-right" | position : top,left,right - left,center,right |
| autoFocus |  포커스 여부 |  true | true , false |
| notValidMessage |   폼 유효하지 않을때 메시지 |   'This value is not valid'  | |
| onMounted |  폼 로드후 이벤트 |  |  |
| fields |  폼필드 [설명](#field-option) | | |
| message |  폼 유효성 체크 메시지 [설명](#form-message) |  | 
  

# Form message
```javascript
required:  '{name} 필수 입력사항입니다.'
string: {
  minLength: '{size} 글자 이상 입력해야합니다.'
  maxLength: '{size} 글자 이상 입력할 수 없습니다.'
};
number: {
  min: '{size} 보다 커야 합니다'
  max: '{size} 보다 커야 합니다'
};
type: {
  message: '{type} 유효하지 않습니다.'
};
```

# Field Option
| key | 설명 | 기본값 | 옵션값 |
|-----|------|-----|-----|
| name |  field name |   |  |
| label |  label |   |  |
| tooltip |  툴팁문구 |   |  |
| disabled |  비활성화 여부 |   |  |
| placeholder |  placeholder |   |  |
| orientation |  차식 field 가 있을경우 방향 | vertical  | horizontal, vertical |
| required |  필수 여부 |   |  |
| regexpType |  정규식 타입 |   | email, url, alpha, alpha-num |
| template | custom value 템플릿 |   |  |
| listItem |  dropdown, radio, checkbox 옵션값 |   |  |
| description |  설명 | labelField: label key <br> valueField: value key<br>  list: 옵션 리스트<br>
  orientation: 방향  |  |
| children | 자식 field 리스트 |   |  |
| onChange | 입력값 변경시 호출되는 메소드 |   |  |
| onClick | button 타입 클릭 이벤트 |   |  |
| fileDownload | file 타입일경우 다운로드 메소드 |   |  |
| renderer | custom renderer |   |  |
| conditional | 보이기 여부 조건 | show: 보이기 여부 <br/>  field: field name <br> eq: 비교 값 <br> custom: custom 체크 메소드   |  |
| renderType |  render type  | text  | number, text, file, textarea, dropdown, radio, checkbox, date(dara-datetimepicker모듈 사용), group, custom |
| customOptions |  date 타입등의 추가 module에서 사용하는 추가 옵션 |   |  |
| style |  width: field 넓이<br> labelHide : label 숨김여부 <br> labelWidth : label 넓이<br>  customClass : custom class <br> valueWidth : value width <br> tabAlign : render type이 tab일 경우 정렬 <br> position : '"[label위치]"-[글자 정렬위치]' <br> -- ex) 'top-left','left-right' |  width: "100%" <br>  labelWidth: 3<br> valueWidth: 9<br> position: "left-right" | position : top,left,right - left,center,right <br> tabAlign:left, center, right|
| rule |  유효성 규칙 | minLength: 최소 길이 <br>  maxLength: 최대길이<br> minimum: 최소값 <br>    exclusiveMinimum: 최소값 포함 여부 <br> maximum: 최대값 <br>exclusiveMaximum: 최대값 포함여부 |  |
| different | field 값이 다른지 비교 | field: field name <br> message: 메시지   |  |
| identical | field 값이 같은지 비교 | field: field name <br> message: 메시지   |  |


## License
Darainfo is under [MIT License](./LICENSE).