const merge = require("webpack-merge").merge;
const common = require("./webpack.common.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        //exclude: /node_modules/u,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        //use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    filename: "dara.form.min.js",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "dara.form.min.css",
    }),
    //, new BundleAnalyzerPlugin()
  ],
});
