var _ = require( 'lodash' ),
  path = require( 'path' ),
  gulp = require( 'gulp' ),
  plumber = require( 'gulp-plumber' ),
  handlebars = require( 'gulp-compile-handlebars' ),
  minifyHTML = require( 'gulp-minify-html' ),
  packageConfig = require( './package.json' );

exports.buildFileList = function( assets ) {
  return _( assets )
    .chain()
    .map( function( asset ) {
      if ( path.extname( asset.name ) === '.js' ) {
        return asset.name;
      }
    } )
    .compact()
    .value();
};

exports.getIndexPageStream = function( stats, isDev, firebaseUrl ) {
  var context = {
    title: packageConfig.description,
    livereloadPort: packageConfig.server.livereload.port,
    hash: stats.hash,
    firebaseUrl: firebaseUrl,
    dev: isDev,
    scripts: exports.buildFileList( stats.assets )
  };

  return gulp.src( path.resolve( packageConfig.sourceFiles.html.directory, packageConfig.sourceFiles.html.filename ) )
    .pipe( plumber() )
    .pipe( handlebars( context ) )
    .pipe( minifyHTML( {
      conditionals: true
    } ) );
};
