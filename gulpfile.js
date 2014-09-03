var gulp = require('gulp'),
  gutil = require('gulp-util'),
  shell = require('gulp-shell'),
  webpack = require('webpack'),
  concatCss = require('gulp-concat-css'),
  cssmin = require('gulp-cssmin'),
  lessCompile = require('gulp-less'),

  // where to look for CSS to include in main bundle
  globalStylesPath = './app/styles',
  componentStylesPath = './app/components',
  componentStylesMatcher = componentStylesPath + '/**/*.less',
  styleFileMatcher = function (matchLess) {
    return globalStylesPath + '/**/*.' + (matchLess ? 'less' : 'css');
  };

gulp.task('default', ['dev']);

gulp.task('dev', ['cssmin', 'webpack-dev', 'runserver', 'watch']);

gulp.task('cssmin', ['less'], function () {
  return gulp.src(styleFileMatcher())
    .pipe(concatCss('global.css'))
    //.pipe(cssmin())
    .pipe(gulp.dest('public/'));
});

gulp.task('less', function () {
  return gulp.src([styleFileMatcher(true), componentStylesMatcher])
    .pipe(lessCompile())
    .pipe(gulp.dest(globalStylesPath + '/compiled/'));
});

gulp.task('webpack-dev', function (cb) {
  webpack(require('./webpack.config.dev.js'), function (err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({
      // output options
    }));
  });
});

gulp.task('test', shell.task('npm test'));

gulp.task('runserver', shell.task('node server.js'));

gulp.task('watch', function () {
  //gulp.watch('**/__tests__/**/*.js', ['test']);
  gulp.watch([styleFileMatcher(), styleFileMatcher(true), componentStylesMatcher], ['cssmin']);
});
