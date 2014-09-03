/** @jsx React.DOM */

var Router = require( 'react-router' );
var Routes = Router.Routes;
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;
var NotFoundRoute = Router.NotFoundRoute;
var Viewport = require( './components/viewport' );
var NotFound = require( './components/notfound' );
var Wizard = require( './components/wizard' );
var Buttons = require( './components/buttons' );

module.exports = (
  <Routes location='history'>
    <Route path='/' handler={Viewport}>
      <DefaultRoute name='buttons' handler={Buttons} />
      <Route path='wizard/:step' name='wizard' handler={Wizard} />
      <NotFoundRoute handler={NotFound} />
    </Route>
  </Routes>
);
