// babel.config.js:
module.exports = {
  presets: [
    // './my-babel-preset.js'
    [
      "@babel/preset-env",
      {
        targets: {
          chrome: "79",
          ie: "11",
        },
        useBuiltIns: "usage", // 'entry', false
        corejs: {
          version: 2,
        },
      },
    ],
  ],
};
