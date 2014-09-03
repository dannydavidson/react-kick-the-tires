var webpack = require( 'webpack' );

module.exports = {
  watch: true,
  devtool: 'source-map',
  target: 'web',
  entry: {
    "main": "./app/main.js",
    "vendor": [ "react", "react-router", "flux", "node-polyglot" ]
  },
  output: {
    path: __dirname + '/public',
    filename: "[name].[id].[chunkhash].js",
    chunkFilename: "[name].[id].[chunkhash].js"
  },
  resolve: {
    unsafeCache: true
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
    new webpack.optimize.OccurenceOrderPlugin( true )
  ]
};
