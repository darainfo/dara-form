const merge = require("webpack-merge").merge;
const common = require("./webpack.common.js");

const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = (env) => {
  return merge(common, {
    mode: "development",
    devtool: "source-map",
    output: {
      filename: "dara.form.js",
    },
    plugins: [env.mode !== "deploy" ? new BundleAnalyzerPlugin() : ""],
    module: {
      rules: [
        {
          test: /\.(sa|sc|c)ss$/i,
          //exclude: /node_modules/u,
          use: ["style-loader", "css-loader", "sass-loader"],
          //use: ["style-loader", "css-loader"],
        },
      ],
    },
  });
};
