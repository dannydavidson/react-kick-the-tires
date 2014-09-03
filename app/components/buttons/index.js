/** @jsx React.DOM */

var _ = require( 'lodash' );
var React = require( 'react' );
var Link = require( 'react-router' ).Link;
var Button = require( 'react-bootstrap/Button' );
var ButtonToolbar = require( 'react-bootstrap/ButtonToolbar' );
var ConfigStore = require( '../../stores/ConfigStore' );

var getStateFromStores = function () {
  return ConfigStore.getConfig() || {};
};

module.exports = React.createClass( {

  getInitialState: function () {
    return getStateFromStores();
  },

  componentDidMount: function () {
    ConfigStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    ConfigStore.removeChangeListener( this._onChange );
  },

  render: function () {
    var buttonStates = this.state.buttonStates;
    var renderedButtons = buttonStates && _( buttonStates ).map(
      function ( isChecked, key ) {
        return (
          <Button
            bsStyle={isChecked ? "success" : "primary"}
            bsSize="large"
            onClick={_.partial(this._onClick, key)}>
            {key}
          </Button>
        );
      }, this );
    return (
      <ButtonToolbar>
        {renderedButtons}
      </ButtonToolbar>
    )
  },

  _onChange: function () {
    this.setState( getStateFromStores() );
  },

  _onClick: function ( key ) {
    ConfigStore.setActiveButton( key );
  }

} );
