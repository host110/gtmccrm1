'use strict'
const baseWebpackConfig = require('./webpack.base.conf')
const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ExtractTextPlugin = require('extract-text-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

const faster = process.env.MODE === 'faster'
const output = process.env.OUTPUT || resolve('dist')

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: false,
  output: {
    path: output
  },
  optimization: {
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new VueLoaderPlugin(),
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    // new webpack.DllReferencePlugin({
    //   manifest: require('./dll-manifest.json')
    // }),
    // extract css into its own file
    // new ExtractTextPlugin({
    //   filename: 'assets/css/[name].[chunkhash:6].css',
    //   allChunks: true
    // }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   template: path.resolve(__dirname, '../src/index.html'),
    //   filename: path.resolve(__dirname, '../dist/index.html'),
    //   chunks: ['app'],
    //   inject: true
    // }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DllReferencePlugin({
      manifest: require('../static/dll-manifest.json')
    }),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: '',
        ignore: ['*.psd']
      },
      {
        from: path.resolve(__dirname, '../src/*.html'),
        to: '',
        flatten: true,
        transform: function (content, path) {
          return content.toString().replace(/__replace_by_time__/g, ~~(Date.now() / 10000))
        }
      }
    ])
  ]
})
if (faster) {
  webpackConfig.optimization = webpackConfig.optimization || {}
  webpackConfig.optimization.minimizer = []
} else {
  webpackConfig.optimization = webpackConfig.optimization || {}
  webpackConfig.optimization.minimizer = [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false
        }
      },
      sourceMap: true,
      parallel: true
    })
  ]
}

module.exports = webpackConfig
