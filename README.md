# 프론트 엔드 개발 환경

## Babel

### 배경

#### 크로스 브라우징

사용하는 말이 달라서 바벨탑이 실패했듯이, 브라우저마다 사용하는 언어가 달라서 프론트 코드는 일관적이지 못한 경우가 많다.
스펙과 브라우저가 개선되고 있지만, 여전히 IE 에서는 프라미스를 이해하지 못한다.
크로스 브라우징을 해결해줄 수 있는 것이 바벨이다. es6 로 작성된 코드를 모든 브라우저에서 동작하도록 호환성을 지켜준다.

#### 바벨의 기본 동작

바벨은 ECMAScript2015 이상의 코드를 적당한 하위 버전으로 바꾸는 것이 주된 역할이다. 이렇게 바뀐 코드는 인터넷 익스프로러나 구버전 브라우져처럼 최신 자바스크립트 코드를 이해하지 못하는 환경에서도 잘 동작한다.

바벨 설치
```
npm install @babel/core @babel/cli
```

바벨 실행
```
npx babel app.js
```

바벨은 세단계로 빌드를 진행한다.

1. 파싱
2. 변환
3. 출력

코드를 읽고 추상 구문 트리로 변환하는 단계를 `파싱`이라고 한다.
이것은 빌드 작업을 처리하기에 적합한 자료구조인데 컴파일러 이론에 사용되는 개념이다.
추상 구문 트리를 변경하는 것이 `변환` 단계이다. 실제로 코드를 변경하는 작업을 한다.
변경된 결과물을 `출력`하는 것을 마지막으로 바벨은 작업을 완료한다.

### 커스텀 플러그인

플러그인을 직접 만들면서 동작이 원리를 살펴 보자.

```js
// myplugin.js:
module.exports = function myplugin() {
  return {
    visitor: {
      Identifier(path) {
        const name = path.node.name

        // 바벨이 만든 AST 노드를 출력한다
        console.log("Identifier() name:", name)

        // 변환작업: 코드 문자열을 역순으로 변환한다
        path.node.name = name.split("").reverse().join("")
      },
    },
  }
}
```

플러그인 형식은 visitor 객체를 가진 함수를 반환해야한다.
이 객체는 바벨이 파싱하여 만든 추상 구문 트리에 접근할 수 있는 메소드를 제공한다.

```
npx babel app.js --plugins ./myplugin.js

Identifier() name: alert
Identifier() name: msg
Identifier() name: window
Identifier() name: alert
Identifier() name: msg

const trela = gsm => wodniw.trela(gsm);
```

Identifier() 메소드로 들어온 인자 path에 접근하면 코드 조각에 접근할 수 있는 것 같다. path.node.name의 값을 변경하는데 문자를 뒤집는 코드다. 결과의 마지막 줄에서 보는것 처럼 이 코드의 문자열 순서가 역전되었다.

우리가 하려는것은 ECMASCript2015로 작성한 코드를 인터넷 익스플로러에서 돌리는 것이다. 먼저 const 코드를 var로 변경하는 플러그인을 만들어 보겠다.

```js
// myplugin.js:
module.exports = function myplugin() {
  return {
    visitor: {
      // https://github.com/babel/babel/blob/master/packages/babel-plugin-transform-block-scoping/src/index.js#L26
      VariableDeclaration(path) {
        console.log("VariableDeclaration() kind:", path.node.kind) // const

        if (path.node.kind === "const") {
          path.node.kind = "var"
        }
      },
    },
  }
}
```

이번에는 vistor 객체에 VariableDeclaration() 메소드를 정의했다. path에 접근해 보면 키워드가 잡히는 걸 알 수 있다. path.node.kind가 const 일 경우 var로 변환하는 코드다.

```
npx babel app.js --plugins ./myplugin.js

VariableDeclaration() kind: const

var alert = msg => window.alert(msg);
```

#### 플러그인 사용하기

이러한 결과를 만드는 것이 block-scoping 플러그인이다. const, let 처럼 블록 스코핑을 따르는 예약어를 함수 스코핑을 사용하는 var 변경한다.

```
npm install @babel/plugin-transform-block-scoping
```

```
npx babel app.js --plugins @babel/plugin-transform-block-scoping

var alert = msg => window.alert(msg);
```

인터넷 익스플로러는 화살표 함수도 지원하지 않는데 arrow-functions 플러그인을 이용해서 일반 함수로 변경할 수 있다.

```
npm install -D @babel/plugin-transform-arrow-functions

npx babel app.js \
  --plugins @babel/plugin-transform-block-scoping \
  --plugins @babel/plugin-transform-arrow-functions

var alert = function (msg) {
  return window.alert(msg);
};
```

ECMAScript5에서부터 지원하는 엄격 모드를 사용하는 것이 안전하기 때문에 "use strict" 구문을 추가해야 겠다. strict-mode 플러그인을 사용하자.

그전에 커맨드라인 명령어가 점점 길어지기 때문에 설정 파일로 분리하는 것이 낫겠다. 웹팩 webpack.config.js를 기본 설정파일로 사용하듯 바벨도 babel.config.js를 사용한다.

```
// strict 설치
npm install @babel/plugin-transform-strict-mode

// babel.config.js:
module.exports = {
  plugins: [
    "@babel/plugin-transform-block-scoping",
    "@babel/plugin-transform-arrow-functions",
    "@babel/plugin-transform-strict-mode",
  ],
}

npx babel app.js
```

### 프리셋

es6 이상으로 코딩할 때 필요한 플러그인을 일일이 설정하는 일일이 설정하는 일은 무척 지난한 일이다.
코드 한 줄 작성하는데도 세 개 플러그인 세팅을 했으니 말이다. 목적에 맞게 여러가지 플러그인을 세트로 모아놓은 것을 "프리셋"이라고 한다.

#### 커스텀 프리셋

```js
// mypreset.js
module.exports = function mypreset() {
  return {
    plugins: [
      "@babel/plugin-transform-arrow-functions",
      "@babel/plugin-transform-block-scoping",
      "@babel/plugin-transform-strict-mode",
    ],
  }
}

// babel.config.js
module.exports = {
  presets: ["./mypreset.js"],
}
```

플러그인 세팅 코드를 제거하고 presets에 방금 만든 mypreset.js를 추가했다. 실행해보면 동일한 결과를 출력할 것이다.