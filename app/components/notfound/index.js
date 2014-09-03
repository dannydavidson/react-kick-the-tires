/** @jsx React.DOM */
var React = require( 'react' );
var Panel = require( 'react-bootstrap/Panel' );
var LocaleStore = require( '../../stores/LocaleStore' );

module.exports = React.createClass( {
  render: function () {
    return (
      <Panel
        header={LocaleStore.getTranslation('HEADER_404')}
        className='notfound'
        bsStyle='warning'>
          <h1>{LocaleStore.getTranslation('BODY_404')}</h1>
      </Panel>
    );
  }
} );
