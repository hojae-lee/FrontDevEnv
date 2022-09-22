const path = require("path");
const MyWebpackPlugin = require("./my-webpack-plugin");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtreactPlugin = require("mini-css-extract-plugin");
const apiMocker = require("connect-api-mocker");

module.exports = {
  mode: "development",
  // 시작점을 기준으로 모든 모듈을 찾아 번들링 해줌.
  entry: {
    main: "./src/app.js",
  },
  // 번들링한 결과를 아웃풋에 전달합니다.
  output: {
    // 절대경로
    path: path.resolve("./dist"),
    filename: "[name].js",
  },
  devServer: {
    overlay: true,
    stats: "errors-only",
    before: (app) => {
      // app은 express 객체
      // app.get("/api/users", (req, res) => {
      //   res.json([
      //     {
      //       id: 1,
      //       name: "Alice",
      //     },
      //     {
      //       id: 2,
      //       name: "Bek",
      //     },
      //     {
      //       id: 3,
      //       name: "Chris",
      //     },
      //   ]);
      // });
      app.use(apiMocker("/api", "mocks/api"));
    },
    hot: true,
  },
  module: {
    rules: [
      {
        // 각 js 파일당 로더가 한 번 씩 호출됨.
        test: /\.css$/,
        // loader use
        use: [
          process.env.NODE_ENV === "production"
            ? MiniCssExtreactPlugin.loader
            : "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          // publicPath: './dist/',
          name: "[name].[ext]?[hash]",
          limit: 20000, // 20kb (파일 용량 제한), 이상이면 file-loader가 자동으로 실행됨.
        },
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    // new MyWebpackPlugin()
    new webpack.BannerPlugin({
      banner: `
        Build Date: ${new Date().toLocaleString()}
        Commit Version: ${childProcess.execSync("git rev-parse --short HEAD")}
        Author: ${childProcess.execSync("git config user.name")}
      `,
    }),
    new webpack.DefinePlugin({
      // 코드 형식
      TWO: "1+1",
      // 문자열 형식
      TWO2: JSON.stringify("1+1"),
      // 객체 형식
      "api.domain": JSON.stringify("http://dev.api.domain.com"),
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: process.env.NODE_ENV === "development" ? "(개발용)" : "",
      },
      minify:
        process.env.NODE_ENV === "production"
          ? {
              collapseWhitespace: true,
              removeComments: true,
            }
          : false,
    }),
    new CleanWebpackPlugin(),
    ...(process.env.NODE_ENV === "production"
      ? [new MiniCssExtreactPlugin({ filename: "[name].css" })]
      : []),
  ],
};
