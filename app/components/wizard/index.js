/** @jsx React.DOM */

var _ = require( 'lodash' );
var React = require( 'react' );
var Link = require( 'react-router' ).Link;
var Button = require( 'react-bootstrap/Button' );
var ConfigStore = require( '../../stores/ConfigStore' );

var getStateFromStores = function () {
  return ConfigStore.getConfig() || {};
};

module.exports = React.createClass( {

  componentDidMount: function () {
    ConfigStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    ConfigStore.removeChangeListener( this._onChange );
  },

  render: function () {
    return (<div></div>)
  },

  _onChange: function () {
    this.setState( getStateFromStores() );
  },

  _onClick: function ( key ) {
    ConfigStore.setActiveButton( key );
  }

} );
