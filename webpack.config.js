const path = require('path');

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
  } 
}