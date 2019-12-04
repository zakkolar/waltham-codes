var path = require('path')
var webpack = require('webpack')
var MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    site: ['./assets/javascripts/index.js', './assets/stylesheets/index.scss']
  },
  output: {
    filename: 'assets/javascripts/[name].js',
    path: path.resolve(__dirname, '.tmp/dist')
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        use:['style-loader','css-loader', 'sass-loader'],
        // use: [
        //   {
        //     loader: MiniCssExtractPlugin.loader,
        //     options: {
        //
        //     }
        //   },
        //     'css-loader',
        //     'postcss-loader',
        //     'sass-loader'
        //
        // ]


      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/stylesheets/[name].css'
    })
  ]
}