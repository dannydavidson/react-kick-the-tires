var _ = require('lodash'),
  through2 = require('through2'),
  path = require('path'),
  gulp = require('gulp'),
  gutil = require('gulp-util'),
  rename = require('gulp-rename'),
  minifyHTML = require('gulp-minify-html'),
  clean = require('gulp-clean'),
  shell = require('gulp-shell'),
  webpack = require('webpack'),
  handlebars = require('gulp-compile-handlebars'),
  concatCss = require('gulp-concat-css'),
  cssmin = require('gulp-cssmin'),
  lessCompile = require('gulp-less'),
  React = require('react'),
  packageConfig = require('./package.json'),

  // where to look for CSS to include in main bundle
  globalStylesPath = './app/styles',
  componentStylesPath = './app/components',
  componentStylesMatcher = componentStylesPath + '/**/*.less',

  styleFileMatcher = function (matchLess) {
    return globalStylesPath + '/**/*.' + (matchLess ? 'less' : 'css');
  },

  fbDeploy = function (srcPath) {
    gulp.src(srcPath)
      .pipe(rename('firebase.json'))
      .pipe(gulp.dest('./'))
      .pipe(shell('firebase deploy'));
  },

  synchro = function (done) {
    return through2.obj(function (data, enc, cb) {
        cb();
      },
      function (cb) {
        cb();
        done();
      });
  },

  writePage = function (err, result, isDev) {
    if (err) throw new gutil.PluginError("webpack", err);
    var stats = result.toJson(),
      context = {
        title: packageConfig.description,
        hash: stats.hash,
        dev: isDev,
        scripts: _(stats.assets)
          .chain()
          .map(function (asset) {
            if (path.extname(asset.name) === '.js') {
              return asset.name;
            }
          })
          .compact()
          .value()
      };

    return gulp.src('./app/index.html')
      .pipe(handlebars(context))
      .pipe(minifyHTML({
        conditionals: true
      }))
      .pipe(gulp.dest('./public'));
  };

gulp.task('clean', function () {
  return gulp.src('./public')
    .pipe(clean({
      read: false
    }));
})

gulp.task('default', ['dev']);

gulp.task('dev', ['cssmin', 'webpack-dev', 'runserver', 'watch']);

gulp.task('cssmin', ['less'], function () {
  return gulp.src(styleFileMatcher())
    .pipe(concatCss('global.css'))
    .pipe(cssmin())
    .pipe(gulp.dest('public/'));
});

gulp.task('less', function () {
  return gulp.src([styleFileMatcher(true), componentStylesMatcher])
    .pipe(lessCompile())
    .pipe(gulp.dest(globalStylesPath + '/compiled/'));
});

gulp.task('webpack-dev', ['clean'], function () {
  webpack(require('./webpack.config.dev.js'), function (err, result) {
    writePage(err, result, true);
  });
});

gulp.task('webpack-prod', ['clean'], function (done) {
  webpack(require('./webpack.config.prod.js'), function (err, result) {
    writePage(err, result).pipe(synchro(done));
  });
});

gulp.task('test', shell.task('npm test'));

gulp.task('runserver', shell.task('node server.js'));

gulp.task('watch', function () {
  gulp.watch([styleFileMatcher(), styleFileMatcher(true), componentStylesMatcher], ['cssmin']);
});

gulp.task('deploy', ['cssmin', 'webpack-prod', 'test'], function () {
  return fbDeploy('./stage.firebase.json');
});

gulp.task('ship', ['cssmin', 'webpack-prod', 'test'], function () {
  return fbDeploy('./prod.firebase.json');
});
