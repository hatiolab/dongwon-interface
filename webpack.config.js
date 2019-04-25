var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  mode: 'production',
  entry: ['@babel/polyfill/noConflict', './src/index.js'],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '',
    libraryTarget: 'window'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            [
              "@babel/preset-env", 
              {
                targets: {
                  ie: 11
                }
            }]
          ]
        }
      }]
    }]
  },
  plugins: [
    new UglifyJsPlugin({
      test: /\-min\.js$/
    })
  ],
  devtool: "source-map"
};