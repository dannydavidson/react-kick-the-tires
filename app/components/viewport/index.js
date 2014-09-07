/** @jsx React.DOM */

var React = require('react');
var Link = require('react-router').Link;

var App = module.exports = React.createClass({

  render: function() {
    return (
      <div className="container">
        <h1>App is so cool</h1>
        <div className="headline">{this.props.headline}</div>
      </div>
    );
  }

});
