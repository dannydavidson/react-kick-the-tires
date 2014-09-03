/** @jsx React.DOM */

var when = require( 'when' );
var Polyglot = require( 'node-polyglot' );
var EventEmitter = require( 'events' ).EventEmitter;
var merge = require( 'react/lib/merge' );
var CHANGE_EVENT = 'change';
var polyglot = new Polyglot();

var DATA_PATH = '/locale';

var LocaleStore = merge( EventEmitter.prototype, {

  init: function (locale) {
    this.locale = locale;
    polyglot.locale(locale);
    return this.connect();
  },

  getTranslation: function ( key, context ) {
    if ( !this.db ) {
      this.connect();
    }
    return polyglot.t( key, context );
  },

  setLocaleKeys: function ( newKeys ) {
    polyglot.replace( newKeys );
    this.emitChange();
  },

  emitChange: function () {
    this.emit( CHANGE_EVENT );
  },

  addChangeListener: function ( cb ) {
    this.on( CHANGE_EVENT, cb );
  },

  removeChangeListener: function ( cb ) {
    this.removeListener( CHANGE_EVENT, cb );
  },

  connect: function () {
    var self = this;
    return when.promise( function ( resolve, reject ) {
      self.db = new Firebase( window.Config.FIREBASE_URL + DATA_PATH + '/' + self.locale );
      self.db.on( 'value', function ( snapshot ) {
        self.setLocaleKeys( snapshot.val() );
        resolve();
      } );
    } );
  },

  disconnect: function () {
    this.db.off( 'value' );
  }

} );

module.exports = LocaleStore;
module.exports.id = DATA_PATH;
