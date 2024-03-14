const path = require("path");

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nodeExternals = require("webpack-node-externals");

const packageJson = require("./package.json");
const topBanner = `/*!
* ${packageJson.name}  v${packageJson.version}
* Copyright 2023-${new Date().getUTCFullYear()} darainfo and other contributors; 
* Licensed ${packageJson.license}
*/`;

process.env.TOP_BANNER = topBanner;

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "dara.form.js",
    library: "DaraForm",
    libraryTarget: "umd",
  },

  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    alias: {
      src: path.resolve(__dirname, "src/"),
      //moment: 'moment/src/moment'
      "@t": path.resolve(__dirname, "src/types"),
    },
  },
  optimization: {
    providedExports: true,
    usedExports: true,
  },
  module: {
    rules: [
      {
        test: /\.ts$|\.tsx$/u,
        exclude: /node_modules/u,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader", "ts-loader"],
      },
      {
        test: /\.js$|\.jsx$/u,
        exclude: /node_modules/u,
        include: path.resolve(__dirname, "src"),
        use: ["babel-loader"],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/u,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "src/index.html",
    }),
    new webpack.BannerPlugin({
      banner: topBanner,
      raw: true,
    }),
    // datepicker version package 에서 가져다 쓸수 있게 수정 할것.

    new webpack.DefinePlugin({
      APP_VERSION: JSON.stringify(packageJson.version), // 패키지 버전을 전역 변수로 설정합니다.
    }),
  ],
};
