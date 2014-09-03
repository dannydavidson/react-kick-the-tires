var _ = require( 'lodash' ),
  request = require( 'request' ),
  uuid = require( 'node-uuid' ),
  exec = require( 'child_process' ).exec,
  path = require( 'path' ),
  del = require( 'del' ),
  through2 = require( 'through2' ),
  plumber = require( 'gulp-plumber' ),
  reversible = require( 'reversible' ),
  gulp = require( 'gulp' ),
  transformJSX = require( 'gulp-react' ),
  jshint = require( 'gulp-jshint' ),
  minifyCss = require( 'gulp-minify-css' ),
  rename = require( 'gulp-rename' ),
  shell = require( 'gulp-shell' ),
  webpack = require( 'webpack' ),
  concat = require( 'gulp-concat' ),
  lessCompile = require( 'gulp-less' ),
  getIndexPageStream = require( './writepage' ).getIndexPageStream,
  buildFileList = require( './writepage' ).buildFileList,
  FirebaseTokenGenerator = require( 'firebase-token-generator' ),

  packageConfig = require( './package.json' ),
  stylesGlob = packageConfig.appRoot + packageConfig.sourceFiles.css.glob,
  markupFilepath = path.resolve(
    packageConfig.sourceFiles.html.directory,
    packageConfig.sourceFiles.html.filename
  ),

  // webpack configs
  webpackStageConfig = require( './webpack.config.stage.js' ),
  webpackProdConfig = require( './webpack.config.prod.js' ),

  // firebase configs
  firebaseStaging = require( './firebase.stage.json' ),
  firebaseProd = require( './firebase.prod.json' ),

  fbDeploy = function ( srcPath ) {
    return gulp.src( srcPath )
      .pipe( rename( 'firebase.json' ) )
      .pipe( gulp.dest( './' ) )
      .pipe( shell( 'firebase deploy -m "v0.0.1"' ) );
  },

  synchro = function ( done ) {
    return through2.obj( function ( data, enc, cb ) {
        cb();
      },
      function ( cb ) {
        cb();
        done();
      } );
  },

  writeStyles = function ( stylesGlob, sendLiveReload ) {
    return gulp.src( stylesGlob )
      .pipe( plumber() )
      .pipe( lessCompile() )
      .pipe( reversible( {
        objectMode: true
      } ) )
      .pipe( concat( packageConfig.outputFiles.css.filename ) )
      .pipe( minifyCss() )
      .pipe( gulp.dest( packageConfig.outputFiles.css.directory ) )
      .on( 'end', function () {
        if ( sendLiveReload ) {
          request.get( 'http://127.0.0.1:' + packageConfig.server.livereload.port +
            '/changed?files=' + packageConfig.outputFiles.css.filename );
        }
      } );
  };

gulp.task( 'default', [ 'dev' ] );

gulp.task( 'dev', [
  'clean',
  'write-styles',
  'server.webpack',
  'server.livereload',
  'watch'
] );

gulp.task( 'clean', function ( done ) {
  del( packageConfig.deployRoot + '/*.+(html|css|js)', function () {
    done();
  } );
} );

gulp.task( 'write-styles', function () {
  return writeStyles( stylesGlob );
} );

gulp.task( 'refresh-styles', function () {
  return writeStyles( stylesGlob, true );
} );

gulp.task( 'refresh-markup', function ( done ) {
  request.get( 'http://127.0.0.1:' + packageConfig.server.livereload.port +
    '/changed?files=' + packageConfig.outputFiles.html.filename, function () {
      done();
    } );
} );

gulp.task( 'webpack-stage', function ( done ) {
  webpack( webpackStageConfig, function ( err, result ) {
    getIndexPageStream( result.toJson(), false, firebaseStaging.firebaseUrl )
      .pipe( gulp.dest( packageConfig.deployRoot ) )
      .pipe( synchro( done ) );
  } );
} );

gulp.task( 'webpack-prod', function ( done ) {
  webpack( webpackProdConfig, function ( err, result ) {
    getIndexPageStream( result.toJson(), false, firebaseProd.firebaseUrl )
      .pipe( gulp.dest( packageConfig.deployRoot ) )
      .pipe( synchro( done ) );
  } );
} );

gulp.task( 'jshint', function () {
  return gulp.src( packageConfig.sourceFiles.js.directory + packageConfig.sourceFiles.js.glob )
    .pipe( transformJSX() )
    .pipe( jshint() )
    .pipe( jshint.reporter( 'jshint-stylish' ) )
    .pipe( jshint.reporter( 'fail' ) );
} );

gulp.task( 'test', shell.task( 'npm test' ) );

gulp.task( 'server.livereload', function () {
  var server = require( './server.livereload' );
  server.start( {
    port: packageConfig.server.livereload.port
  } );
} );

gulp.task( 'server.webpack', function () {
  var server = require( './server.webpack' ),
    webpackConfig = require( './webpack.config.dev' );

  server.start( {

    port: packageConfig.server.webpack.port,
    directory: packageConfig.deployRoot,

    webpackConfig: webpackConfig,

    indexPath: path.resolve(
      packageConfig.sourceFiles.html.directory,
      packageConfig.sourceFiles.html.filename
    ),

    onBuild: function ( stats ) {
      var filelist = _( buildFileList( stats.assets ) )
        .reduce( function ( memo, asset, index, list ) {
          return memo + asset + ( ( index === list.length - 1 ) ? '' : ',' );
        }, '' );
      request.get( 'http://127.0.0.1:' + packageConfig.server.livereload.port + '/changed?files=' + filelist );
    }
  } );
} );

gulp.task( 'verify-is-master', function ( done ) {
  exec( 'git rev-parse --abbrev-ref HEAD', function ( err, stdout ) {
    if ( stdout.indexOf( 'master' ) === -1 ) {
      console.log( 'ERROR: You must ship from master' );
      process.exit( 1 );
    }
    done();
  } );
} );

gulp.task( 'verify-committed', function ( done ) {
  exec( 'git status --porcelain', function ( err, stdout ) {
    if ( /\w+/g.test( stdout ) ) {
      console.log( 'ERROR: You must have a clean working copy to deploy' );
      process.exit( 1 );
    }
    done();
  } );
} );

gulp.task( 'version-deploy', function () {
  // TODO match git tag with package.json version with firebase deploy commit message
} );

gulp.task( 'run-mongo', shell.task( 'mongod --config ./mongo.dev.conf' ) );

gulp.task( 'watch', function () {
  gulp.watch( [ stylesGlob ], [ 'refresh-styles' ] );
  gulp.watch( [ markupFilepath ], [ 'refresh-markup' ] );
} );

gulp.task( 'gen-firebase-token', function () {
  var secret = require( packageConfig.firebaseSecretPath || './firebase.secret.key' ).secret;
  var tokenGenerator = new FirebaseTokenGenerator( secret );
  process.stdout.write(
    tokenGenerator.createToken( {
      uid: 'custom:' + uuid.v4()
    } ) + '\n'
  )
} )

gulp.task( 'build', [ 'clean', 'write-styles', 'webpack-stage' ] );
gulp.task( 'build-prod', [ 'clean', 'jshint', 'test', 'write-styles', 'webpack-prod' ] )

gulp.task( 'stage', [ 'verify-committed', 'build' ], function () {
  return fbDeploy( './firebase.stage.json' );
} );

gulp.task( 'ship', [ 'verify-is-master', 'verify-committed', 'build-prod' ], function () {
  return fbDeploy( './firebase.prod.json' );
} );
