# 프론트 엔드 개발 환경

## 웹팩 개발 서버

### 배경

지금까지 브라우저에 파일을 직접 로딩해서 결과물을 확인했다.
인터넷에 웹사이트를 게시하려면 서버 프로그램으로 이 파일을 읽고 요청한 클라이언트에게 제공해야 한다.

개발환경에서도 이와 유사한 환경을 갖추는 것이 좋다. 운영환경과 맞춤으로써 배포시 잠재적 문제를 미리 확인할 수 있다.
게다가 ajax 방식의 api 연동은 cors 정책 때문에 반드시 서버가 필요하다.

프론트엔드 개발환경에서 이러한 개발용 서버를 제공해 주는 것이 Webpack-dev-server 이다.

### 설치 및 사용

Webpack-dev-server 패키지를 설치한다.

```cmd
npm install Webpack-dev-server
```

node_modules/.bin 에 있는 webpack-dev-server 명령어를 바로 실행해도 되지만 npm 스크립트로 등록해서 사용했다.

package.json

```json
{
  "scripts": {
    "start": "webpack-dev-server"
  }
}
```

로컬 호스트의 8080 포트에 서버가 구동되어서 접속을 대기하고 있다. 웹팩 아웃풋인 dist 폴더는 루트 경로를 통해 접속할 수 있다.

브라우져 주소창에 http://localhost:8080 으로 접속해 보면 결과물을 확인할 수 있다.

소스 코드를 수정하고 저장해 보자. 웹팩 서버는 파일 변화를 감지하면 웹팩 빌드를 다시 수행하고 브라우져를 리프레시하여 변경된 결과물을 보여준다.

### 기본 설정

웹팩 설정 파일의 devServer 객체에 개발 서버 옵션을 설정할 수 있다.

webpack.config.js

```js
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    publicPath: "/",
    host: "dev.domain.com",
    overlay: true,
    port: 8081,
    stats: "errors-only",
    historyApiFallback: true,
  },
}
```

**contentBase**: 정적 파일을 제공할 경로. 기본값은 웹팩 아웃풋이다.
**publicPath**: 브라우저를 통해 접근하는 경로. 기본값은 '/' 이다.
**host**: 개발환경에서 도메인을 맞추어야 하는 상황에서 사용한다. 예를 들어 쿠키 기반의 인증은 인증 서버와 동일한 도메인으로 개발환경을 맞추어야 한다. 운영체제의 호스트 파일에 해당 도메인과 127.0.0.1 연결한 추가한 뒤, host 속성에 도메인을 설정해서 사용한다.
**overlay**: 빌드시 에러나 경고를 브라우저 화면에 표시한다.
**port**: 개발 서버 포트 번호를 설정한다. 기본값: 8080.
**stats**: 메세지 수준을 정할 수 있다. none', 'errors-only', 'minimal', 'normal', 'verbose' 로 메세지 수준을 조절한다.
**historyApiFallBack**: 히스토리 API를 사용하는 SPA 개발시 설정한다. 404가 발생하면 index.html로 리다이렉트한다.

이외에도 개발 서버 실행시 명령어 인자로 `--progress` 를 추가하면 빌드 진행율을 보여준다. 빌드 시간이 길어질 경우, 사용하면 좋다.

메세지 출력 옵션만 설정한 뒤,

```js
// webpack.config.js:
module.exports = {
  devServer: {
    overlay: true,
    stats: "errors-only",
  },
}
```

package.json

```json
{
  "scripts": {
    "start": "webpack-dev-server --progress"
  }
}
```

## API 연동

프론트엔드에서는 서버와 데이터를 주고 받기 위해 ajax 를 사용한다. 보통은 api 서버를 어딘가에 띄우고 프론트 서버와 함께 개발한다.
개발 환경에서 이러한 api 서버 구성을 어떻게 하는지 알아보자.

### 목업 API 1: devServer.before

웹팩 개발 서버 설정 중 before 속성은 웹팩 서버에 기능을 추가할 수 있는 여지를 제공한다.
이것을 이해하려면 노드 Express.js 에 사전지식이 있으면 유리하다. 간단히 말하면 익스프레스는 미들웨어 형태로 서버 기능을 확장할 수 있는 웹프레임웍이다. devServer.before에 추가하는 것이 바로 미들웨어인 셈이다. 아래 코드를 보자.

```js
// webpack.config.js
module.exports = {
  devServer: {
    before: (app, server, compiler) => {
      app.get("/api/keywords", (req, res) => {
        res.json([
          { keyword: "이탈리아" },
          { keyword: "세프의요리" },
          { keyword: "제철" },
          { keyword: "홈파티" },
        ])
      })
    },
  },
}
```

before에 설정한 미들웨어는 익스프레스에 의해서 app 객체가 인자로 전달되는데 Express 인스턴스다. 이 객체에 라우트 컨트롤러를 추가할 수 있는데 app.get(url, controller) 형태로 함수를 작성한다. 컨트롤러에서는 요청 req과 응답 res 객체를 받는데 여기서는 res.json() 함수로 응답하는 코드를 만들었다.

```cmd
npm install axios
```

```js
// src/model.js:
import axios from "axios"

// const data = [
//   {keyword: '이탈리아'},
//   {keyword: '세프의요리'},
//   {keyword: '제철'},
//   {keyword: '홈파티'},
// ]

const model = {
  async get() {
    // return data

    const result = await axios.get("/api/keywords")
    return result.data
  },
}

export default model
```

기존에는 data에 데이터를 관리했는데 이제는 ajax 호출 후 응답된 데이터를 반환하도록 변경했다. 화면을 확인해 보면 웹펙에서 설정한 api 응답이 화면에 나오는걸 확인할 수 있다.

### 목업 API 2: connect-api-mocker

목업 api 작업이 많을때는 connect-api-mocker 패키지의 도움을 받자. 특정 목업 폴더를 만들어 api 응답을 담은 파일을 저장한 뒤, 이 폴더를 api로 제공해 주는 기능을 한다.

```cmd
npm install connect-api-mocker
```

mocks/api/keywords/GET.json 경로에 API 응답 파일을 만든다.

GET 메소드를 사용하기때문에 GET.json으로 파일을 만들었다(물론 POST, PUT, DELETE 도 지원).

GET.json:

```json
[
  { "keyword": "이탈리아" },
  { "keyword": "세프의요리" },
  { "keyword": "제철" },
  { "keyword": "홈파티 " }
]
```

기존에 설정한 목업 응답 컨트롤러를 제거하고 connect-api-mocker로 미들웨어를 대신한다.

```js
// webpack.config.js:
const apiMocker = require("connect-api-mocker")

module.exports = {
  devServer: {
    before: (app, server, compiler) => {
      app.use(apiMocker("/api", "mocks/api"))
    },
  },
}
```

익스프레스 객체인 app은 get() 메소드 뿐만 아니라 미들웨어 추가를 위한 범용 메소드 use()를 제공하는데, 이를 이용해 목업 미들웨어를 추가했다. 첫번째 인자는 설정할 라우팅 경로인데 /api로 들어온 요청에 대해 처리하겠다는 의미다. 두번째 인자는 응답으로 제공할 목업 파일 경로인데 방금 만든 mocks/api 경로를 전달했다.

목업 API 갯수가 많다면 직접 컨트롤러를 작성하는 것 보다 목업 파일로 관리하는 것을 추천한다.

### 실제 API 연동: devServer.proxy

이번에는 api 서버를 로컬환경에서 띄운 다음 목업이 아닌 이 서버에 직접 api 요청을 해보자.
로컬호스트 8081 포트에 아래와 같이 서버가 구성되었다고 가정하겠다.

```cmd
$ curl localhost:8081/api/keywords
[{"keyword":"이탈리아"},{"keyword":"세프의요리"},{"keyword":"제철"},{"keyword":"홈파티"}]
```

```js
// src/model.js
const model = {
  async get() {
    // const result = await axios.get('/api/keywords');

    // 직접 api 서버로 요청한다.
    const { data } = await axios.get("http://localhost:8081/api/keywords")
    return data
  },
}
```

웹팩 개발서버를 띄우고 화면을 확인해 보자. 잘 나오는가? 브라우져 개발자 도구에 보면 다음과 같은 오류 메세지가 출력된다.
localhost:8080에서 localhost:8081 로 ajax 호출을 하지 못하는데 이유는 CORS 정책 때문이라는 메세지다. 요청하는 리소스에 "Access-Control-Allow-Origin" 헤더가 없다는 말도 한다.

CORS(Cross Origin Resource Shaing) 브라우져와 서버간의 보안상의 정책인데 브라우저가 최초로 접속한 서버에서만 ajax 요청을 할 수 있다는 내용이다. 방금같은 경우는 localhost로 같은 도메인이지만 포트번호가 8080, 8081로 달라서 다른 서버로 인식하는 것이다.

해결하는 방법은 두 가지인데 먼저 서버측 솔루션 부터 보자. 해당 api 응답 헤더에 "Access-Control-Allow-Origiin: *" 헤더를 추가한 뒤 응답하면, 브라우져에서 응답 데이터를 받을 수 있다.

```js
// server/index.js
app.get("/api/keywords", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*") // 헤더를 추가한다
  res.json(keywords)
})
```

한편 프론트엔드 측 해결방법을 보자. 서버 응답 헤더를 추가할 필요없이 웹팩 개발 서버에서 api 서버로 프록싱하는 것이다. 웹팩 개발 서버는 proxy 속성으로 이를 지원한다.

```js
// webpack.config.js
module.exports = {
  devServer: {
    proxy: {
      "/api": "http://localhost:8081", // 프록시
    },
  },
}
```

개발서버에 들어온 모든 http 요청중 /api로 시작되는것은 http://localhost:8081로 요청하는 설정이다. api 호출코드를 다시 복구한 뒤,

```js
// src/model.js
const model = {
  async get() {
    // const { data } = await axios.get('http://localhost:8081/api/keywords');

    const { data } = await axios.get("/api/keywords")
    return data
  },
}
```

확인해보면 정상 동작하는 것을 확인할 수 있다.

## 핫 모듈 리플레이스먼트

### 배경

웹팩 개발서버는 코드의 변화를 감지해서 전체 화면을 갱신하기 때문에 개발 속도를 높일 수 있다. 하지만 어떤 상황에서는 전체 화면을 갱신하는 것이 좀 불편한 경우도 있다.
SPA 는 브라우저에서 데이터를 들고 있기 때문에 리프레시 후에 모든 데이터가 초기화 되어 버리기 때문이다. 다른 부분을 수정했는데 입력한 폼 데이터가 날아가 버리는 경우도 있고 말이다.

전체 화면 갱신하지 않고 변경한 모듈만 바꿔치기 한다면 어떨까? 핫 모듈 리플레이스먼트 는 이러한 목적으로 제공되는 웹팩 개발서버의 한 기능이다.

### 설정

설정은 간단하다. devServer.hot 속성을 켠다.

```js
// webpack.config.js:
module.exports = {
  devServer = {
    hot: true,
  },
}
```

`view.js` 를 사용하는 컨트롤러 코드를 잠깐 읽어보자.

```js
// src/controller.js
import model from "./model"
import view from "./view"

const controller = {
  async init(el) {
    this.el = el
    view.render(await model.get(), this.el)
  },
}

export default controller
```

컨트롤러는 model과 view에 의존성이 있는데 이 둘을 이용해 데이터를 가져와 화면을 렌더한다. 만약 view 모듈에 변화가 있을 경우 전체 화면을 갱신하지 않고 변경된 view 모듈만 다시 실행하는 것이 핫 모듈의 작동 방식이다. 이 기능을 만들기 위해 컨트롤러 하단에 다음 코드를 추가해보자.

```js
// src/controller.js

// 중략
export default controller

if (module.hot) {
  console.log("핫모듈 켜짐")

  module.hot.accept("./view", () => {
    console.log("view 모듈 변경됨")
  })
}
```

`devServer.hot` 옵션을 켜면 웹팩 개발 서버 위에서 `module.hot` 객체가 생성된다. 이 객체의 accept() 메소드는 감시할 모듈과 콜백 함수를 인자로 받는다. 위에서는 view.js 모듈을 감시하고 변경이 있으면 전달한 콜백 함수가 동작하도록 했다.

이 콜백 함수 안에서 변경된 view 모듈을 이용하면 view 모듈을 교체할 수 있을 것 같다. model로 데이터를 부르고 다시 변경된 view 모듈로 렌더 함수를 실행했다.

```js
// src/controller.js

if (module.hot) {
  module.hot.accept("./view", async () => {
    view.render(await model.get(), controller.el) // 변경된 모듈로 교체
  })
}
```

view.js 코드를 변경하고 저장하면 브라우져 갱신 없이 화면이 변경된다.

### 핫로딩을 지원하는 로더

이러한 HMR 인터페이스를 구현한 로더만이 핫 로딩을 지원하는데 웹팩 기본편에서 보았던 style-loader가 그렇다. 잠깐 코드를 보면 hot.accept() 함수를 사용한 것을 알 수 있다.

스타일 로더 코드

참고: style-loader 코드

이 외에도 리액트를 지원하는 react-hot-loader, 파일을 지원하는 file-loader는 핫 모듈 리플레이스먼트를 지원하는데 여기를 참고하자.
