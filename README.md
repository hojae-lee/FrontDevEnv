# 프론트 엔드 개발 환경

## 린트

- 코드의 오류나 버그, 스타일 따위를 점검하는 것을 린트(Lint)라고 부릅니다.

### 린트가 필요한 상황

아래 코드를 봐보자. console.log() 함수를 실행 후, 즉시 실행함수를 실행하려는 코드이다.

```js
console.log()(function () {})()
```

하지만 이 코드를 브라우저에서 실행해 보면 TypeError 가 발생한다. 브라우저는 세미콜론을 자동으로 넣는 과정을 수행하는데, 위와 같은 경우 의도대로 해석하지 못하고
저대로 해석된다.
모든 문장에 세미콜론을 붙였다면, 예방할 수 있는 버그이다.

린트는 코드의 가독성을 높이는 것 뿐만 아니라 동적 언어의 특성인 런타임 버그를 예방하는 역할도 한다.

## ESLint

### 기본 개념

ESLint 는 ECMAScript 코드에서 문제점을 검사하고 일부는 더 나은 코드로 정정하는 린트 도구 중의 하나이다. 코드의 가독성을 높이고 잠재적인 오류와 버그를 제거해
단단한 코드를 만드는 것이 목적이다. 과거 JSLint, JSHint 에 이어서 최근에는 ESLint 를 많이 사용하고 있다.

코드에서 검사하는 항목을 크게 분류하면 아래 두가지다.

- 포멧팅
- 코드 품질

1. 포멧팅은 일관된 코드 스타일을 유지하도록 하고 개발자로 하여금 쉽게 읽히는 코드를 만들어 준다. 예를 들어, 들여쓰기, 코드 라인의 최대 너비 규격이 있다.
2. 코드품질은 어플리케이션의 잠재적인 오류, 버그를 예방하기 위함이다. 사용하지 않는 변수 쓰지 않기, 글로벌 스코프 함부로 다루지 않기 등 오류 발생 확률을 줄여준다.

### 설치

```cmd
npm install eslint
```

.eslintrc.js

```js
module.exports = {}
```

`app.js` 를 `eslint` 로 검사해보자.

```cmd
npx eslint app.js
```

### 규칙

ESLint 는 검사 규칙을 미리 정해 놓았다.

```js
// .eslintrc.js
module.exports = {
  rules: {
    "no-unexpected-multiline": "error",
  },
}
```

규칙에 설정하는 값은 세 가지다. off(0): 끔, warn(1): 경고, error(2): 에러.

```cmd
npx eslint app.js
2:1 error  Unexpected newline between function and ( of function call  no-unexpected-multiline

✖ 1 problem (1 error, 0 warnings)
```

예상대로 에러가 발생하고 코드 위치와 위반한 규칙명을 알려준다. 함수와 함수 호출의 괄호 "(" 사이에 줄바꿈이 있는데 이것이 문제라고 한다. 코드 앞에 세미콜론을 넣거나 모든 문의 끝에 세미콜론을 넣어 문제를 해결할 수 있다. 수정한 다음 다시 검사하면 검사에 통과할 것이다.

### 자동으로 수정할 수 있는 규칙

자바스크립트 문장 뒤에 세미콜론을 여러 개 중복 입력해도 어플리케이션은 동작한다. 그러나 이것은 코드를 읽기 어렵게 하는 장애물일 뿐이다. 이렇게 작성한 코드가 있다면 실수로 입력한게 틀림 없다.

이 문제와 관련된 규칙은 no-extra-semi 규칙이다.

```js
// .eslintrc.js
module.exports = {
  rules: {
    "no-extra-semi": "error",
  },
}
```

```cmd
npx eslint app.js
1:15  error  Unnecessary semicolon  no-extra-semi

✖ 1 problem (1 error, 0 warnings)
  1 error and 0 warnings potentially fixable with the `--fix` option.
```

마지막 줄의 메세지를 보면 이 에러는 "잠재적으로 수정가능(potentially fixable)"하다고 말한다. --fix 옵션을 붙여 검사해보면 오류가 발생한 코드를 자동으로 수정한다.

```cmd
npx eslint app.js --fix
```

### Extensible Config

이러한 규칙을 여러개 미리 정해 놓은 것이 `eslint:recommended` 설정이다.
[규칙 목록](https://eslint.org/docs/latest/rules/) 중에 체크 표시가 있는 것이 설정에서 활성화 되어 있는 규칙이다.

```js
// .eslintrc.js
module.exports = {
  extends: [
    "eslint:recommended", // 미리 설정된 규칙 세트을 사용한다
  ],
}
```

ESLint에서 기본으로 제공하는 설정 외에 자주 사용하는 두 가지가 있다.

- airbnb
- standard

1. airbnb 설정은 [airbnb 스타일 가이드](https://github.com/airbnb/javascript)를 따르는 규칙 모음이다. [eslint-config-airbnb-base](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) 패키지로 제공된다.
2. standard 설정은 [자바스크립트 스탠다드 스타일](https://standardjs.com/)을 사용한다. [eslint-config-standard](https://github.com/standard/eslint-config-standard) 패키지로 제공된다.

### 초기화

사실 이러한 설정은 --init 옵션을 추가하면 손쉽게 구성할 수 있다.

```cmd
npx eslint --init

? How would you like to use ESLint?
? What type of modules does your project use?
? Which framework does your project use?
? Where does your code run?
? How would you like to define a style for your project?
? Which style guide do you want to follow?
? What format do you want your config file to be in?
```

어떤 프레임웍을 사용하는지, 어플리케이션이 어떤 환경에서 동작하는지 등에 답하면 된다. 답변에 따라 .eslintrc 파일을 자동으로 만들 수 있다.

## 프리티어

프리티어는 코드를 더 이쁘게 만드는 도구이다.
eslint 와 겹치는 부분이 있지만 eslint 보다 코드 스타일을 다듬는다.
eslint 는 코드 품질, prettier 는 코드 스타일.

### 설치 및 사용법
프리티어 패키지를 다운로드 하고

```cmd
npm i -D prettier
```
코드를 아래 처럼 작성한다.

```js
// app.js
console.log("hello world")
```
Prettier로 검사해 보자.

npx prettier app.js --write
--write 옵션을 추가하면 파일을 재작성한다. 그렇지 않을 경우 결과를 터미널에 출력한다.

변경된 모습을 보면,

// app.js
console.log("Hello world")
작은 따옴표를 큰 따옴표로 변경했다. 문장 뒤에 세미콜론도 추가했다. 프리티어는 ESLint와 달리 규칙이 미리 세팅되어 있기 때문에 설정 없이도 바로 사용할 수 있다.

### 통합방법

eslint 와 프리티어를 같이 사용하는 것이 최선이고, 같이 사용할 경우 서로 충돌하는 규칙을 끄는 역할을 추가해야한다.

```cmd
npm install eslint-config-prettier
```

```js
// .eslintrc.js
{
  extends: [
    "eslint:recommended",
    "eslint-config-prettier"
  ]
}
```

npx prettier app.js --write && npx eslint app.js --fix

eslint-plugin-prettier 를 설치하여 프리티어 규칙을 eslint 규칙으로 추가하도록 한다. eslint 만 실행하면 됨.

```cmd
npm install eslint-plugin-prettier
```

```js
// .eslintrc.js
{
  plugins: [
    "prettier"
  ],
  rules: {
    "prettier/prettier": "error"
  },
}
```

```js
// .eslintrc.js
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ]
}
```

### 자동화

깃 커밋시에 자동으로 eslint 를 설정한다.
husky 는 깃 훅을 쉽게 사용할 수 있게 해주는 도구이다.

```cmd
npm install husky
```

package.json

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "echo \"이것은 커밋전에 출력됨\""
    }
  }
}
```

코드가 점점 많아지면 커밋 작성이 느려질 수 있는데, 모든 코드를 린트로 검사하지 말고 `lint-staged` 를 사용해서 변경된 파일만 린트로 검사하는 방법을 추가하자.


```cmd
npm install lint-staged
```

package.json

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.js": "eslint --fix"
  }
}
```

### 에디터 확장도구

vscode 에서 eslint 를 설치 후, .vscode/settings.json 에 들어가서 아래 json 을 추가해줍니다.

```json
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}
```

저장시 자동으로 eslint 가 적용된다.

### 정리

읽기 좋은 코드는 유지보수 하기좋다. 그만큼 어플리케이션의 수명은 오래갈 수 있다. 여럿이서 함께 일하는 환경에서 손으로 코드를 관리하는 것은 무척 번거럽고 어쩌면 불가능한 일일지도 모른다. 규칙이 정해졌고 자동화할 수 있다면 도구의 도움을 받는 것이 현명하다.

ESLint는 오류와 버그의 가능성을 찾아 코드 품질을 높이는 역할을 한다. 프리티어는 코드를 일관적으로 포매팅하기 때문에 읽기 수월한 코드를 만들어 준다. 이러한 도구를 개발 플로우의 적절한 시점에 통합하여 자동화하면 개발자는 좀 더 본질적인 코딩에 집중할 수 있을 것이다.