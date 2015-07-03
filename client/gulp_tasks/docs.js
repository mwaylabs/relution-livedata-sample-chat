/**
 * Created by pascalbrewing on 28/10/14.
 */
'use strict';
var gulp = require('gulp');
var gulpDocs = require('gulp-ngdocs');
var del = require('del');
var fs = require('fs');
var json = JSON.parse(fs.readFileSync('package.json', 'utf8'));
gulp.task('clean:docs', function (cb) {
  del([
    'docs/**'
  ], cb);
});
var options = {
  html5Mode: true,
  title: "Relutionlivedata Sample Chat - "+ json.version,
  image: "http://www.relution.io/de/wp-content/themes/Divi/images/logo.png",
  imageLink: "https://github.com/mwaylabs/relution-livedata-sample-chat"
};
gulp.task('docs', ['clean:docs'], function () {
  return gulp.src(['./app/**/*.js', '!./app/app.js', '!./app/bootstrap.js', '!bower_components/**/*.js'])
    .pipe(gulpDocs.process(options))
    .pipe(gulp.dest('./docs'));
});
