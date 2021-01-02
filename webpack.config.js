const path = require("path");

module.exports = {
  entry: ["babel-polyfill", "./frontend/src/index.jsx"],
  output: {
    path: path.resolve(__dirname),
    filename: "./frontend/bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          query: {
            presets: ["@babel/env", "@babel/react"],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".js", ".jsx", "*"],
  },
  watch: process.env.NODE_ENV !== "production" ? true : false,
  watchOptions: { poll: process.env.NODE_ENV !== "production" ? true : false },
};
