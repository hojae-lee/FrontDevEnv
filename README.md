# 프론트 엔드 개발 환경

## 로더

### 로더의 역할

웹팩은 모든 파일을 모듈로 바라봄.
자바스크립트로 만든 모듈 뿐만 아니라 스타일시트, 이미지, 폰트까지도 전부 모듈로 보기 때문에
import 구문을 사용하면 자바스크립트 코드 안으로 가져올 수 있다.

이것이 가능한 이유는 웹팩의 로더 덕분임. 로더는 타입스크립트 같은 다른 언어를 자바스크립트 문법으로
변환해 주거나 이미지를 data URL 형식의 문자열로 변환한다.
뿐만 아니라 CSS 파일을 자바스크립트에서 직접 로딩 할 수 있도록 해준다.

### 커스텀 로더 만들기

로더를 사용하기 전에 동작 원리를 이해하기 위해 로더를 직접 만들어보자.

myloader.js
```js
module.exports = function myloader(content) {
  console.log("myloader가 동작함")
  return content
}
```

로더가 읽은 파일의 내용이 함수 인자 content 로 전달됨.
로더가 동작하는지 확인하는 용도로 로그만 찍고 곧장 content 를 돌려 준다.
로더를 사용하려면 웹팩 설정파일의 module 객체에 추가한다.

webpack.config.js
```js
module: {
  rules: [{
    test: /\.js$/, // .js 확장자로 끝나는 모든 파일
    use: [path.resolve('./myloader.js')] // 방금 만든 로더를 적용한다
  }],
}
```

`module.rules` 배열에 모듈을 추가하는데 test 와 use 로 구성된 객체를 전달한다.

`test` 에는 로딩에 적용할 파일, 정규표현식으로 만든 파일 패턴을 지정할 수 있음.

`use` 에는 이 패턴에 해당하는 파일에 적용할 로더를 설정하는 부분.

로더가 뭔가를 처리하기 위해서 간단한 변환 작업을 아래에 추가.

myloader.js
```js
module.exports = function myloader(content) {
  console.log("myloader가 동작함")
  return content.replace("console.log(", "alert(") // console.log( -> alert( 로 치환
}
```

### 자주 사용하는 로더

#### css-loader

웹팩은 모든것을 바라보기 때문에 자바스크립트 뿐만 아니라 css 파일을 모듈로 불러 올 수 있습니다.

app.js
```js
import "./style.css" 
```

style.css
```css
body {
  background-color: green;
}
```

css 파일을 자바스크립트에서 불러와 사용하려면 css 모듈로 변환하는 작업이 필요합니다.
css-loader 가 그러한 역할을 함.

```
npm install -D css-loader
```

만약 css-loader 설치시 오류 발생하면 버전 문제입니다. 웹팩과 버전을 맞춰줘야함.

webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/, // .css 확장자로 끝나는 모든 파일
        use: ["css-loader"], // css-loader를 적용한다
      },
    ],
  },
}
```

웹팩은 엔트리 포인트부터 시작해서 모듈을 검색하다가 CSS 파일을 찾으면 css-loader 로 처리됨. 빌드한 결과 css 코드가 자바스크립트로 변환된 것을 볼 수 있음.
하지만 변환만 된 것이고 `cssom tree` 를 만들지 못했음으로 화면에 결과가 나오지 않음.
이러한 결과를 나오게 하기 위해 `style-loader` 를 사용해야함.

### style-loader

css-loader 로 처리시 자바스크립트 코드로만 변경되었을 뿐, 돔에 적용되지 않았기 때문에
style-loader 를 사용하여 자바스크립트로 변경된 스타일을 동적으로 돔에 추가해줍니다.


```
npm install style-loader
```

만약 style-loader 설치시 오류 발생하면 버전 문제입니다. 웹팩과 버전을 맞춰줘야함.

webpack.config.js

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"], // style-loader를 앞에 추가한다
      },
    ],
  },
}
```

### file-loader

css 뿐만 아니라, 소스코드에서 사용하는 모든 파일을 모듈로 사용하게끔 할 수 있다.
파일을 모듈 형태로 지원하고 웹팩 아웃풋에 파일을 옮겨주는 것이 file-loader 가 하는 일이다. 가령 CSS 에서 url 함수에 이미지 파일 경로를 지정할 수 있는데, 웹팩은 file-loader 를 이용해서 이 파일을 처리한다.

style.css
```css
body {
  background-image: url(bg.png);
}
```

배경 이미지를 bg.png 파일로 지정했다.

webpack.config.js
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/, // .png 확장자로 마치는 모든 파일
        loader: "file-loader", // 파일 로더를 적용한다
      },
    ],
  },
}
```

웹팩이 .png 파일을 발견하면 `file-loader`를 실행할 것이다. 
로더가 동작하고 나면 아웃풋에 설정한 경로로 이미지 파일을 복사된다. 아래 그림처럼 파일명이 해쉬코드로 변경 되었다. 캐쉬 갱신을 위한 처리로 보인다.

하지만, 이대로 index.html 파일을 브라우져에 로딩하면 이미지를 제대로 로딩하지 못할 것이다. CSS를 로딩하면 `background-image: url(bg.png)` 코드에 의해 동일 폴더에서 이미지를 찾으려고 시도할 것이다. 그러나 웹팩으로 빌드한 이미지 파일은 output인 dist 폴더 아래로 이동했기 때문에 이미지 로딩에 실패할 것이다.

file-loader 옵션을 조정해서 경로를 바로 잡아 주어야 한다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/, // .png 확장자로 마치는 모든 파일
        loader: "file-loader",
        options: {
          publicPath: "./dist/", // prefix를 아웃풋 경로로 지정
          name: "[name].[ext]?[hash]", // 파일명 형식
        },
      },
    ],
  },
}
```

`publicPath` 옵션은 `file-loader`가 처리하는 파일을 모듈로 사용할 때 경로 앞에 추가되는 문자열이다. `output` 에 설정한 'dist' 폴더에 이미지 파일을 옮길 것이므로 `publicPath` 값을 이것으로 지정했다. 파일을 사용하는 측에서는 'bg.png'를 'dist/bg.png'로 변경하여 사용할 것이다.

`name` 옵션을 사용했는데 이것은 로더가 파일을 아웃풋에 복사할때 사용하는 파일 이름이다.

### url-loader

사용하는 이미지 갯수가 많다면 네트웍 리소스를 사용하는 부담이 있고 사이트 성능에 영향을 줄 수도 있다.
만약 한 페이지에서 작은 이미지를 여러 개 사용한다면 [Data URI Scheme](https://en.wikipedia.org/wiki/Data_URI_scheme) 을 이용하는 방법이 더 나은 경우도 있다. 이미지를 Base64로 인코딩하여 문자열 형태로 소스코드에 넣는 형식이다.

```
npm install url-loader
```

webpack.config.js

```js
module.exports = {
  mode: 'development',
  // 시작점을 기준으로 모든 모듈을 찾아 번들링 해줌.
  entry: {
    main: './src/app.js'
  },
  // 번들링한 결과를 아웃풋에 전달합니다.
  output: {
    // 절대경로
    path: path.resolve('./dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        // 각 js 파일당 로더가 한 번 씩 호출됨.
        test: /\.css$/,
        // loader use
        use: [
          'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader', // url 로더를 설정
        options: {
          publicPath: './dist/',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20kb (파일 용량 제한), 이상이면 file-loader가 자동으로 실행됨.
        }
      }
    ]
  }
}
```

file-loader 와 옵션 설정이 거의 비슷하고, 마지막 limit 속성만 추가됨.
limit 속성에 따라 20kb 미만인 파일은 url-loader 를 적용하고, 이보다 크면 file-loader 가 처리됨.

아이콘처럼 용량이 작거나 사용 빈도가 높은 이미지는 파일을 그대로 사용하기 보다는 Data URI Scheeme을 적용하기 위해 url-loader를 사용하면 좋겠다.

## 플러그인

### 플러그인의 역할

웹팩에서 알아야 할 마지막 기본 개념이 플러그인 입니다.
로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리합니다.
번들된 자바스크립트를 난독화 한다거나 특정 텍스트를 추출하는 용도로 사용한다.

### 커스텀 플러그인 만들기

웹팩 문서의 [Writing a plugin](https://webpack.js.org/contribute/writing-a-plugin/)을 보면 클래스로 플러그인을 정의 하도록 한다. 헬로월드 코드를 가져다 그대로 실행 붙여보자.

my-webpack-plugin.js
```js
class MyWebpackPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("My Plugin", stats => {
      console.log("MyPlugin: done")
    })
  }
}

module.exports = MyWebpackPlugin
```

로더와 다르게 플러그인은 클래스로 제작한다. apply 함수를 구현하면 되는데 이 코드에서는 인자로 받은 compiler 객체 안에 있는 tap() 함수를 사용하는 코드입니다. 플러그인 작업이 완료되는 시점(done)에 로그를 찍는 코드 인 것 같다.

```js
const MyPlugin = require("./myplugin")

module.exports = {
  plugins: [
    new MyWebpackPlugin()
  ],
}
```

웹팩 설정 객체의 `plugins` 배열에 설정한다. 클래스로 제공되는 플러그인의 생성자 함수를 실행해서 넘기는 방식입니다.

어떻게 번들 결과에 접근할 수 있을까? 웹팩 내장 플러그인 [BannerPlugin] (https://github.com/lcxfs1991/banner-webpack-plugin/blob/master/index.js) 을 참고하자.

```js
class MyPlugin {
  apply(compiler) {
    compiler.hooks.done.tap("My Plugin", stats => {
      console.log("MyPlugin: done")
    })

    // compiler.plugin() 함수로 후처리한다
    compiler.plugin("emit", (compilation, callback) => {
      const source = compilation.assets["main.js"].source()
      console.log(source)
      callback()
    })
  }
}
```

`compiler.plugin()` 함수의 두번째 인자인 콜백함수는 `emit` 이벤트가 발생하면 실행되는 녀석이며, 번들된 결과가 `compilation` 객체에 들어 있는데 `compilation.assets['main.js'].source()` 함수로 접근할 수 있다. 실행하면 터미널에 번들링된 결과물을 확인할 수 있다.
이걸 이용해서 번들 결과 상단에 아래와 같은 배너를 추가하는 플러그인으로 만들어보자.

```js
class MyPlugin {
  apply(compiler) {
    compiler.plugin('emit', (compilation, callback) => {
      const source = compilation.assets['main.js'].source();
      compilation.assets['main.js'].source = () => {
        const banner = [
          '/**',
          ' * 이것은 BannerPlugin이 처리한 결과입니다.',
          ' * Build Date: 2019-10-10',
          ' */'
          ''
        ].join('\n');
        return banner + '\n' + source;
      }

      callback();
    })
  }
}
```
번들 소스를 얻어오는 함수 `source()`를 재정의 했다. 배너 문자열과 기존 소스 코드를 합친 문자열을 반환하도록 말이다.

### 자주 사용하는 플러그인

#### BannerPlugin

MyPlugin 와 비슷한 것이 BannerPlugin 이다. 결과물에 빌드 정보나 커밋 버전 같은 걸 추가할 수 있다.

webpack.config.js

```js
const webpack = require('webpack');

module.exports = {
  plugins: [
    new webpack.BannerPlugin({
      banner: '이것은 배너 입니다',
    })
  ]
}
```

생성자 함수에 전달하는 옵션 객체의 banner 속성에 문자열을 전달한다. 웹팩 컴파일 타임에 얻을 수 있는
정보, 가령 빌드 시간이나 커밋정보를 전달하기 위해 함수로 전달할 수도 있다.

#### DefinePlugin

프론트 개발은 개발환경과 운영환경으로 나눠서 운영한다.
가령 환경에 따라 API 서버 주소가 다를 수 있다. 같은 소스 코드를 두 환경에 배포하기 위해서는 이러한 환경 의존적인 정보를 소스가 아닌 곳에서 관리하는 것이 좋다.
배포할 때 마다 코드를 수정하는 것은 곤란하기 때문이다.
웹팩은 이러한 환경 정보를 제공하기 위해 DefinePlugin 을 제공한다.

webpack.config.js
```js
const webpack = require("webpack")

export default {
  plugins: [new webpack.DefinePlugin({})],
}
```

빈 객체를 전달해도 기본적으로 넣어주는 값이 있다.
노드 환경정보인 process.env.NODE_ENV 인데, 웹팩 설정의 mode에 설정한 값이 여기에 들어간다. development 를 설정했다면 development, production 이면, production 이 들어 있다.

```js
console.log(process.env.NODE_ENV);

new webpack.DefinePlugin({
  // 코드 형식
  TWO: '1+1',
  // 문자열 형식
  TWO2: JSON.stringify('1+1'),
  // 객체 형식
  'api.domain': JSON.stringify('http://dev.api.domain.com')
}),
```

빌드 타임에 결정된 값을 어플리케이션에 전달할 때 플러그인을 사용하자.

#### HtmlWebpackPlugin

HTML 파일을 후처리하는데 사용한다. 빌드 타임의 값을 넣거나 코드를 압축할 수 있다.

```
npm install html-webpack-plugin
```

이 플러그인으로 빌드하면 HTML 파일로 아웃풋에 생성될 것 이다.

src/index.html
```html
<!DOCTYPE html>
<html>
  <head>
    <title>타이틀<%= env %></title>
  </head>
  <body>
    <!-- 로딩 스크립트 제거 -->
    <!-- <script src="dist/main.js"></script> -->
  </body>
</html>
```

타이틀 부분에 ejs 문법을 이용하는데 `<%= env>` 는 전달받은 env 변수 값을 출력한다.
HtmlWebpackPlugin 은 이 변수에 데이터를 주입시켜 동적으로 HTML 코드를 생성한다.
뿐만 아니라 웹팩으로 빌드한 결과물을 자동으로 로딩하는 코드를 주입해 준다.
때문에 html 에 스크립트 로딩 코드도 제거한다.

webpack.config.js
```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports {
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 템플릿 경로를 지정
      templateParameters: { // 템플릿에 주입할 파라매터 변수 지정
        env: process.env.NODE_ENV === 'development' ? '(개발용)' : '',
      },
    })
  ]
}
```

환경 변수에 따라 타이틀 명 뒤에 "(개발용)" 문자열을 붙이거나 떼거나 하도록 했다. `NODE_ENV=development` 로 설정해서 빌드하면 빌드결과 "타이틀(개발용)"으로 나온다. `NODE_ENV=production` 으로 설정해서 빌드하면 빌드결과 "타이틀"로 나온다.

webpack.config.js:

```js
new HtmlWebpackPlugin({
  minify: process.env.NODE_ENV === 'production' ? {
    collapseWhitespace: true, // 빈칸 제거
    removeComments: true, // 주석 제거
  } : false,
}
```

환경변수에 따라 minify 옵션을 켰다.

#### CleanWebpackPlugin

`CleanWebpackPlugin` 은 빌드 이전 결과물을 제거하는 플러그인이다.
빌드 결과물은 아웃풋 경로에 모이는데 과거 파일이 남아 있을 수 있다.
이전 빌드내용이 덮여 씌여지면 상관없지만 그렇지 않으면 아웃풋 폴더에 여전히 남아 있을 수 있다.

```
npm install clean-webpack-plugin
```

webpack.config.js

```js
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

module.exports = {
  plugins: [new CleanWebpackPlugin()],
}
```

빌드 결과 기존 폴더가 삭제 된 후 결과물이 다시 생성된 것을 알 수 있다.

#### MiniCssExtractPlugin

스타일 시트가 점점 많아지면 하나의 자바스크립트 결과물로 만드는 것이 부담일 수 있다.
번들 결과에서 스타일 시트 코드만 뽑아서 별도의 CSS 파일로 만들어 역할에 따라
파일을 분리하는 것이 좋다. 브라우저에서 큰 파일 하나를 내려받는 것보다 여러 개의
작은 파일을 동시에 다운로드 하는 것이 더 빠르다.
개발 환경에서는 하나의 모듈로 처리해도 상관없지만, 프로덕션 환경에서는 분리해서 처리하는 것이 효과적이다.

```
npm install mini-css-extract-plugin
```

webpack.config.js

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin")

module.exports = {
  plugins: [
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtractPlugin({ filename: `[name].css` })]
      : []),
  ],
}
```

프로덕션 환경일 경우만 이 플러그인을 추가했다.
`filename` 에 설정한 값으로 아웃풋 경로에 css 파일이 생성될 것입니다.
개발 환경에서는 css-loader 에 의해 자바스크립트 모듈로 변경된 스타일 시트를 적용하기 위해 style-loader 를 사용했다. 반면 프로덕션 환경에서는 별도의 CSS 파일로 추출하는 플러그인을 적용했으므로 다른 로더가 필요하다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader // 프로덕션 환경
            : "style-loader", // 개발 환경
          "css-loader",
        ],
      },
    ],
  },
}
```

플러그인에서 제공하는 `MiniCssExtractPlugin.loader` 로더를 추가한다.

`dist/main.css`가 생성되었고 index.html에 이 파일을 로딩하는 코드가 추가되었다.

#### 정리

엔트리포인트를 시작으로 연결되어 었는 모든 모듈을 하나로 합쳐서 결과물을 만드는 것이 웹팩의 역할이다. 자바스크립트 모듈 뿐만 아니라 스타일시트, 이미지 파일까지도 모듈로 제공해 주기 때문에 일관적으로 개발할 수 있다.