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