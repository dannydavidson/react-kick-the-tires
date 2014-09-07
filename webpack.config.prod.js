var webpack = require('webpack'),
  AppCachePlugin = require('appcache-webpack-plugin');

module.exports = {
  target: 'web',
  entry: {
    "main": "./app/main.js",
    "vendor": ["react", "react-router"]
  },
  output: {
    path: __dirname + '/public',
    filename: "[name].[hash].js",
    chunkFilename: "[name].[hash].js"
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: "style-loader!css-loader!less-loader"
      },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      {
        test: /\.js$/,
        loader: 'jsx-loader'
      }
    ],
    noParse: /\.min\.js/
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.[hash].js"),
    new webpack.IgnorePlugin(/vertx/),
    new webpack.optimize.OccurenceOrderPlugin(true),
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: true
    }),
    new AppCachePlugin()
  ]
};
