/** @jsx React.DOM */

var _ = require( 'lodash' );
var when = require( 'when' );
var EventEmitter = require( 'events' ).EventEmitter;
var merge = require( 'react/lib/merge' );
var CHANGE_EVENT = 'change';
var user;
var users = {};

var CONNECTED_PATH = '/.info/connected';
var DATA_PATH = '/users';

var UserStore = merge( EventEmitter.prototype, {

  init: function () {
    var self = this;
    return when.all( [ this.connect(), this.login() ] )
      .then( function () {
        self.initConnectionCheck();
      } );
  },

  getActiveUsers: function () {
    return _( users ).filter( function ( user ) {
        return user.connected;
      } )
      .value();
  },

  setUsers: function ( newUsers ) {
    users = newUsers;
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
      self.users = new Firebase( window.Config.FIREBASE_URL + DATA_PATH );
      self.users.on( 'value', function ( snapshot ) {
        self.setUsers( snapshot.val() );
        resolve();
      } );
    } );
  },

  disconnect: function () {
    this.db.off( 'value' );
  },

  login: function () {
    var self = this;
    var hasLoggedIn = false;
    this.userRef = new Firebase( window.Config.FIREBASE_URL );

    return when.promise( function ( resolve, reject ) {
      var authClient = new FirebaseSimpleLogin( self.userRef, function ( error, userData ) {
        if ( error ) {
          reject();
        } else if ( userData !== null ) {
          user = userData;
          if ( !hasLoggedIn ) {
            hasLoggedIn = true;
            resolve();
          }
        }
      } );

      authClient.login( "anonymous" );
    } );

  },

  initConnectionCheck: function () {
    var self = this;
    this.connectedStateRef = new Firebase( window.Config.FIREBASE_URL + CONNECTED_PATH );

    this.connectedStateRef.on( 'value', function ( snapshot ) {
      if ( snapshot.val() ) {
        self.setUserConnected();
      } else {
        self.setUserDisconnected();
      }
    } );
  },

  setUserConnected: function () {
    this.users.child( user.uid ).update( {
      connected: true
    } );
    this.users.child( user.uid ).onDisconnect().update( {
      connected: false
    } );
  },

  setUserDisconnected: function () {
    this.users.child( user.uid ).update( {
      connnected: false
    } );
  }

} );

module.exports = UserStore;
module.exports.id = DATA_PATH;
