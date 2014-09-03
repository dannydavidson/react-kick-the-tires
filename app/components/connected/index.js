/** @jsx React.DOM */

var _ = require( 'lodash' );
var React = require( 'react' );
var Link = require( 'react-router' ).Link;
var Button = require( 'react-bootstrap/Button' );
var ButtonToolbar = require( 'react-bootstrap/ButtonToolbar' );
var UserStore = require( '../../stores/UserStore' );

var getStateFromStores = function () {
  return {
    active: UserStore.getActiveUsers()
  };
};

module.exports = React.createClass( {

  getInitialState: function () {
    return getStateFromStores();
  },

  componentDidMount: function () {
    UserStore.addChangeListener( this._onChange );
  },

  componentWillUnmount: function () {
    UserStore.removeChangeListener( this._onChange );
  },

  render: function () {
    var active = this.state.active;
    var renderedConnected = active && _( active ).map(
      function ( user, index) {
        return (
          <Button
            bsStyle="success"
            bsSize="small"
            key={index}>
            {index + 1}
          </Button>
        );
      }, this );
    return (
      <ButtonToolbar className="connected-list">
        {renderedConnected}
      </ButtonToolbar>
    )
  },

  _onChange: function () {
    this.setState( getStateFromStores() );
  }

} );
