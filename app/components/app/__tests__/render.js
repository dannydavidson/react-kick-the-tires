/** @jsx React.DOM */

jest.dontMock('../../app');

describe('Component app', function () {

  it('renders properly', function () {
    var React = require('react/addons');
    var App = require('../../app');
    var TestUtils = React.addons.TestUtils;
    var text = 'This is a headline';

    var app = TestUtils.renderIntoDocument(
      <App headline={text} />
    );

    var headline = TestUtils.findRenderedDOMComponentWithClass(app, 'headline');

    expect(headline.getDOMNode().textContent).toEqual(text);

  });

});
