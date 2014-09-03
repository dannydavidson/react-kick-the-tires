/** @jsx React.DOM */

var _ = require( 'lodash' );
var React = require( 'react' );
var Router = require( 'react-router' );
var Connected = require('../connected');
var Link = require( 'react-router' ).Link;
var Grid = require( 'react-bootstrap/Grid' );
var Row = require( 'react-bootstrap/Row' );
var Col = require( 'react-bootstrap/Col' );
var PageHeader = require( 'react-bootstrap/PageHeader' );
var Button = require( 'react-bootstrap/Button' );
var ButtonToolbar = require( 'react-bootstrap/ButtonToolbar' );
var LocaleStore = require( '../../stores/LocaleStore' );
var ConfigStore = require( '../../stores/ConfigStore' );

var HEADLINE_REF = 'headlineRef';
var HEADLINE_CLASS = 'headline';

var localState = {
  editingHeadline: false
};

var getStateForComponent = function () {
  return {
    config: ConfigStore.getConfig() || {},
    localState: localState
  };
};

module.exports = React.createClass( {

  getInitialState: function () {
    return getStateForComponent();
  },

  componentDidMount: function () {
    ConfigStore.addChangeListener( this._onChange );
    window.addEventListener( 'click', this.checkForUnfocus );
  },

  componentWillUnmount: function () {
    ConfigStore.removeChangeListener( this._onChange );
    window.removeEventListener( 'click', this.checkForUnfocus );
  },

  componentDidUpdate: function () {
    var el;
    if ( this.state.localState.editingHeadline ) {
      el = this.refs[ HEADLINE_REF ].getDOMNode();
      el.focus();
    }
  },

  render: function () {
    var headline;
    var headlineComponent;
    var config = this.state.config;
    var buttonsPrompt = LocaleStore.getTranslation( 'PROMPT_BUTTONS' );
    var notFoundPrompt = LocaleStore.getTranslation( 'PROMPT_NOT_FOUND' );

    if ( _( config.headline ).isUndefined() ) {
      headline = LocaleStore.getTranslation( 'PROMPT_LOADING' );
    } else if ( config.headline === '' ) {
      headline = LocaleStore.getTranslation('PROMPT_ADD_CONTENT');
    } else {
      headline = config.headline;
    }

    if ( this.state.localState.editingHeadline ) {

      headlineComponent = (
        <input
          type='text'
          className={HEADLINE_CLASS}
          ref={HEADLINE_REF}
          onChange={this.onHeadlineEdit}
          onKeyUp={this.onHeadlineKeyUp}
          value={this.state.config.headline}
        />
      );

    } else {

      headlineComponent = (
        <span
          ref={HEADLINE_REF}
          className={HEADLINE_CLASS}
          onClick={this.onHeadlineClick}>
            {headline}
        </span>
      );

    }

    return (
      <Grid>
        <Row>
          <Col sm={12} md={8} mdOffset={2} lg={6} lgOffset={3} className="viewport">
            <PageHeader>
              {headlineComponent}
              <ButtonToolbar>
                <Link to='buttons'>
                  <Button bsStyle="primary" bsSize="xsmall">
                    {buttonsPrompt}
                  </Button>
                </Link>
                <Button
                  bsStyle="warning"
                  bsSize="xsmall"
                  onClick={this._simulate404}>
                    {notFoundPrompt}
                </Button>
              </ButtonToolbar>
            </PageHeader>
            {this.props.activeRouteHandler()}
            <Connected />
          </Col>
        </Row>
      </Grid>
    );
  },

  _onChange: function () {
    this.setState( getStateForComponent() );
  },

  _simulate404: function () {
    Router.transitionTo( '/404ish' );
  },

  checkForUnfocus: function ( evt ) {
    var classes = evt.target.className;
    var isNotInputRef = classes.indexOf( HEADLINE_CLASS ) === -1;
    if ( isNotInputRef ) {
      localState.editingHeadline = false;
      this.setState( getStateForComponent() );
    }
  },

  onHeadlineEdit: function ( evt ) {
    ConfigStore.setHeadline( evt.target.value );
  },

  onHeadlineKeyUp: function ( evt ) {
    if ( evt.keyCode === 13 || evt.keyCode === 27 ) {
      localState.editingHeadline = false;
      this.setState( getStateForComponent() );
    }
  },

  onHeadlineClick: function ( evt ) {
    localState.editingHeadline = true;
    this.setState( getStateForComponent() );
  }

} );
