/** @jsx React.DOM */

var _ = require( 'lodash' );
var EventEmitter = require( 'events' ).EventEmitter;
var merge = require( 'react/lib/merge' );
var CHANGE_EVENT = 'change';
var config = {};

var DATA_PATH = '/config';

var ConfigStore = merge( EventEmitter.prototype, {

  getConfig: function () {
    if ( !this.db ) {
      this.connect();
    }
    return config;
  },

  setConfig: function ( newConfig ) {
    config = merge( config, newConfig );
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
    this.db = new Firebase( window.Config.FIREBASE_URL + DATA_PATH );
    this.db.on( 'value', function ( snapshot ) {
      self.setConfig( snapshot.val() );
    } );
  },

  disconnect: function () {
    this.db.off( 'value' );
  },

  setActiveButton: function ( key ) {
    var buttonStates = this.db.child( 'buttonStates' );
    buttonStates.update( _.object( [ key ], [ !config.buttonStates[ key ] ] ) );
  },

  setHeadline: function (headline) {
    var head = this.db.child('headline');
    head.set(headline);
  }

} );

module.exports = ConfigStore;
module.exports.id = DATA_PATH;
