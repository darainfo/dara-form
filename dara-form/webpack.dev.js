const merge = require('webpack-merge').merge;
const common = require('./webpack.common.js');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (env) => {
  return merge(common, {
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: 'dara.form.js',
    },
    plugins: [
      env.mode !== 'deploy' ? new BundleAnalyzerPlugin() : '',
    ]
  });


}
