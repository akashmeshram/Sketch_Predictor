const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack"); //to access built-in plugins

module.exports = {
  entry: "./src/index.js",
  plugins: [
    new HtmlWebpackPlugin({ template: "./index.html" }),
    new CopyPlugin({
      patterns: [
        { from: "model", to: "model" },
        { from: "css", to: "css" },
      ],
    }),
  ],
};
