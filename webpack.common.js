const path = require("path");

const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nodeExternals = require("webpack-node-externals");

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
      inject: false,
      templateParameters: (compilation, assets, tags, options) => {
        tags.headTags.forEach((tag) => {
          if (tag.tagName === "script") {
            tag.attributes.async = true;
          }
        });
        return {
          htmlWebpackPlugin: { options },
        };
      },
      template: "src/index.html",
    }),
  ],
};
