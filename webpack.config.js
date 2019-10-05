const fs = require("fs");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const webpackConfig = {
  mode: "development",
  devtool: "inline-source-map",
  entry: fs.readdirSync(`${__dirname}/src`).reduce((entries, dir) => {
    const fullDir = path.join(`${__dirname}/src`, dir);
    const entry = path.join(fullDir, "index.ts");
    if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
      entries[dir] = ["webpack-hot-middleware/client", entry];
    }
    return entries;
  }, {}),
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "__build__/"),
    publicPath: "/__build__/",
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: "ts-loader",
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  devServer: {
    contentBase: "./dist",
    hot: true,
    host: "localhost",
    port: "3100",
    overlay: true,
    inline: true,
    stats: "errors-only",
    proxy: {},
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: "Learn-Canvas",
      template: "index.html",
      filename: "index.html"
    }),
    new HtmlWebpackPlugin({
      title: "Learn-Canvas-1",
      template: "src/learn-1/index.html",
      filename: "learn-1/index.html"
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ]
};

module.exports = webpackConfig;
