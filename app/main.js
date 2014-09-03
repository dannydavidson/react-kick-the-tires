var React = require( 'react' );
var when = require( 'when' );
var url = require( 'url' );
var qs = require( 'qs' );
var routes = require( './routes' );
var LocaleStore = require( './stores/LocaleStore' );
var UserStore = require( './stores/UserStore' );
var q = qs.parse( url.parse( window.location.href ).query );

window.React = React;

when.all( [
  LocaleStore.init( q.locale || 'en' ),
  UserStore.init()
] )
  .timeout(3000)
  .then( function () {
    React.renderComponent( routes, document.getElementById( 'app' ) );
    setTimeout( function () {
      document.querySelector( '#page-loader' ).className = 'loaded';
    }, 0 );
  } )
  .catch( function () {
    alert( 'We failed!!' );
  } );
