'use strict';
const merge = require('webpack-merge');
var webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {

  entry: [
    'webpack-dev-server/client/index.js?http://localhost:8080/'
  ],

  mode: 'development',

  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },

  devServer: {
    port: 8080,
    historyApiFallback: true
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]

});
