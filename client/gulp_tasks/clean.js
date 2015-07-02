/**
 * Created by pascalbrewing on 28/10/14.
 */
'use strict';
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
gulp.task('clean:www', function () {
  del('www');
});

gulp.task('clean:platforms', function () {
  del('platforms');
});

gulp.task('clean:plugins', function () {
  del('plugins');
});
