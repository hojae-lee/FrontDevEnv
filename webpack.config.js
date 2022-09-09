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
        loader: 'url-loader',
        options: {
          publicPath: './dist/',
          name: '[name].[ext]?[hash]',
          limit: 20000, // 20kb (파일 용량 제한), 이상이면 file-loader가 자동으로 실행됨.
        }
      }
    ]
  }
}