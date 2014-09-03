/** @jsx React.DOM */

var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var App = require('./components/app');

module.exports = (
  <Routes location="history">
    <Route handler={App}></Route>
  </Routes>
);
