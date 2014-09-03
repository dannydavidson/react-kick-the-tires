var webpack = require( 'webpack' );

module.exports = {
  target: 'web',
  devtool: 'source-map',
  entry: {
    "main": "./app/main.js",
    "vendor": [ "react", "react-router", "es6-shim", "flux", "node-polyglot" ]
  },
  output: {
    path: __dirname + '/public',
    filename: "[name].[hash].js",
    chunkFilename: "[name].[hash].js"
  },
  module: {
    loaders: [ {
      test: /mod\.less$/,
      loader: "style-loader!css-loader!less-loader"
    }, {
      test: /\.css$/,
      loader: "style-loader!css-loader"
    }, {
      test: /\.js$/,
      loader: 'jsx-loader'
    } ],
    noParse: /\.min\.js/
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin( "vendor", "vendor.[hash].js" ),
    new webpack.IgnorePlugin( /vertx/ ),
    new webpack.optimize.OccurenceOrderPlugin( true ),
    new webpack.optimize.UglifyJsPlugin( {
      output: {
        comments: false
      }
    } )
  ]
};
