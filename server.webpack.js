var path = require( 'path' );
var through2 = require( 'through2' );
var connect = require( 'connect' );
var compress = require( 'compression' );
var body = require( 'body-parser' );
var static = require( 'serve-static' );
var webpackDevMiddleware = require( 'webpack-dev-middleware' );
var webpack = require( 'webpack' );
var packageConfig = require( './package.json' );

var getIndexPageStream = require( './writepage' ).getIndexPageStream;
var firebaseStaging = require( './firebase.stage.json' );

var app = connect();
var indexTemplateStream;

var Server = {
  _port: 9000,
  _directory: 'public',

  port: function( port ) {
    this._port = port;
  },

  directory: function( dir ) {
    this._directory = dir;
  },

  start: function( options ) {
    options = options || {};
    var compiler = webpack( options.webpackConfig );

    var port = process.env.PORT || options.port || this._port;
    var directory = options.directory || this._directory;

    app.use( body.json() );
    app.use( body.urlencoded( {
      extended: true
    } ) );

    app.use( webpackDevMiddleware( compiler, {
      noInfo: true,
      onBuild: options.onBuild
    } ) );

    app.use( function( req, res, next ) {
      var filepath = req.url.split( '?' )[ 0 ];
      if ( /.*\.\w+$/.test( filepath ) ) {
        next();
      } else {
        getIndexPageStream( req.webpack, true, firebaseStaging.firebaseUrl )
          .pipe( through2.obj( function( vFile, enc, callback ) {
            this.push( vFile.contents.toString( 'utf-8' ) );
            callback();
          } ) )
          .pipe( res );
      }

    } );

    app.use( static( directory ) );
    app.use( compress() );

    app.listen( port, function() {
      console.log( 'Dev server started on ' + port );
    } );
  }
};

module.exports = Server;
