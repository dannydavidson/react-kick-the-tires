/** @jsx React.DOM */

jest.dontMock( '../index' );
jest.dontMock( 'lodash' );

describe( 'Viewport #component', function () {

  var React = require( 'react/addons' );
  var TestUtils = React.addons.TestUtils;

  var ConfigStore = require( '../../../stores/ConfigStore' );
  var Viewport = require( '../index' );
  var headlineText = 'this is a headline';
  var mockComponent = jest.genMockFunction();

  it( 'should render loading state when ConfigStore is uninitialized', function () {

    var app = TestUtils.renderIntoDocument(
      <Viewport activeRouteHandler={mockComponent} />
    );

    var headline = TestUtils.findRenderedDOMComponentWithTag( app, 'h1' );

    expect( headline.getDOMNode().textContent ).toEqual( 'Loading' );

  } );

  it( 'should render headline from ConfigStore', function () {

    ConfigStore.getConfig = jest.genMockFunction().mockReturnValue( {
      headline: headlineText
    } );

    var app = TestUtils.renderIntoDocument(
      <Viewport />
    );

    var headline = TestUtils.findRenderedDOMComponentWithTag( app, 'h1' );

    expect( headline.getDOMNode().textContent ).toEqual( headlineText );

  } );

} );
