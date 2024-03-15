const merge = require("webpack-merge").merge;
const common = require("./webpack.common.js");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  devtool: "source-map",
  optimization: {
    providedExports: true,
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        test: /\.(js|jsx)$/,
        extractComments: {
          condition: /^\**!/i,
          filename: (fileData) => {
            // The "fileData" argument contains object with "filename", "basename", "query" and "hash"
            return `${fileData.filename}.LICENSE.txt${fileData.query}`;
          },
          banner: (licenseFile) => {
            return "";
          },
        },
        parallel: true,
        terserOptions: {
          format: {
            //comments: false,
            preamble: process.env.TOP_BANNER,
          },
        },
      }),
      new CssMinimizerPlugin({
        test: /\.(sa|sc|c)ss$/i,
      }),
    ],
  },
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
    filename: common.output.filename.replace(/\.js$/, ".min.js"),
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: common.output.filename.replace(/\.js$/, ".min.css"),
    }),
    //, new BundleAnalyzerPlugin()
  ],
});
