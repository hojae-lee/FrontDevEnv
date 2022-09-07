# 프론트 엔드 개발 환경

## 웹팩

### 배경

문법 수준에서 모듈을 지원하기 시작한 것은 ES2015 ~ 입니다. (import/export 구문)
그 전에는 script를 하나씩 로딩해줘서 사용했음.

```html
<script src="src/math.js"></script>
<script src="src/app.js"></script>
```

위와 같이 사용할시 전역 공간에 노출된다는 문제가 발생함.

### IIFE 방식의 모듈

위와 같은 문제를 해결하기 위해 IIFE ,즉시 실행 함수 표현법을 사용합니다.

```js
var math = math || {};

(function() {
  function sum (a, b) {
    return a + b;
  }
  
  math.sum = sum;
})()

console.log(math.sum(1, 2));
```

### 다양한 모듈 스펙

`AMD, CommonJS` 가 대표적인 명세입니다.

`CommonJS` 는 자바스크립트를 사용하는 모든 환경에서 모듈을 하는 것이 목표입니다.
`exports` 키워드로 모듈을 만들고 `require` 함수로 불러 들이는 방식입니다.
대표적으로 Node.js 환경에서 이를 사용합니다.

```js
exports function sum (a, b) { return a + b; }

const sum = require('./math.js');
sum(1, 2); // 3
```

`AMD` 는 비동기로 로딩되는 환경에서 모듈을 사용하는 것이 목표이며, 브라우저 환경

`UMD` 는 `AMD` 기반으로 `CommonJS` 방식까지 지원하는 통합 형태 입니다.

es6 부터는 표준 모듈 시스템을 내놓았습니다.

```js
exports function sum (a, b) { return a + b; }

import * as math from './math.js';
math.sum(1, 2); // 3
```

### 브라우저의 모듈 지원

모든 브라우저에서 모듈 시스템을 지원하지 않음.

```html
<script type="module" src="app.js"></script>
```

npx lite-server: 현재 기준 폴더로 서버를 하나 만들어줌.

브라우저에 무관하게 모듈을 사용하고 싶은 경우, 웹팩을 사용해야 하는 것이었던 것이다람쥐.

### 엔트리/아웃풋

웹팩은 여러개 파일을 하나의 파일로 합쳐주는 번들러 입니다.
하나의 시작점인 엔트리를 기준으로 의존된 모듈을 찾아내 하나의 결과물을 만들어 냅니다.

**Webpack 설치**

**웹팩 4버전 설치**

```
npm i webpack@4
```

**웹팩 cli 설치**

devDependencies 에는 개발용 버전
```
npm install -D webpack webpack-cli
```

**webpack.config.js**
```js
const path = require("path")

module.exports = {
  mode: "development",
  // 시작점
  entry: {
    main: "./src/app.js",
  },
  // 결과물
  output: {
    filename: "[name].js",
    // 절대 경로를 사용, path의 resolve 함수를 사용해 계산
    path: path.resolve("./dist"),
  },
}
```

**package.json**

모든 옵션을 웹팩 설정 파일로 옮겼기 때문에 `webpack` 명령어만 실행합니다.
```json
{
  "scripts": {
    "build": "webpack"
  }
}
```