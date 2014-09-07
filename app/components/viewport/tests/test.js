/** @jsx React.DOM */

jest.dontMock('../index');

describe('Component app', function () {

  it('renders properly', function () {
    var React = require('react/addons');
    var App = require('../index');
    var TestUtils = React.addons.TestUtils;
    var text = 'This is a headline';

    var app = TestUtils.renderIntoDocument(
      <App headline={text} />
    );

    var headline = TestUtils.findRenderedDOMComponentWithClass(app, 'headline');

    expect(headline.getDOMNode().textContent).toEqual(text);

  });

});
