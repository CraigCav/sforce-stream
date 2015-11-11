const webpack = require('webpack');

module.exports = {
  entry: './index.js',
  target: 'web',
  output: {
    libraryTarget: 'umd',
    library: 'sforce-stream',
    path: './dist',
    filename: 'sforce-stream.min.js'
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
  ]
};