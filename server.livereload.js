var tinylr = require( 'tiny-lr' );
var connect = require( 'connect' );
var body = require( 'body-parser' );
var app = connect();

var Server = {
  _port: 35729,

  port: function( port ) {
    this._port = port;
  },

  start: function( options ) {
    options = options || {};

    var port = process.env.PORT || options.port || this._port;

    app.use( body.json() );
    app.use( body.urlencoded( {
      extended: true
    } ) );

    app.use( tinylr.middleware( {
      app: app
    } ) );

    app.listen( port, function() {
      console.log( 'Livereload server started on ' + port );
    } );

  }
};

module.exports = Server;
