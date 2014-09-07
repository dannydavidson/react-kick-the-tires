/** @jsx React.DOM */

var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var Viewport = require('./components/viewport');

module.exports = (
  <Routes location="history">
    <Route handler={Viewport}></Route>
  </Routes>
);
