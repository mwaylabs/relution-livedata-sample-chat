/**
 * Created by pascalbrewing on 14/10/14.
 */
'use strict';
var fs = require('fs');
var path = require('path');
var sys = require('sys');
var command = process.argv[2] || 'add';
var yoConfigJson = require('../.yo-rc.json');
var gulp = require('gulp');
var $ = require('gulp-load-plugins');

gulp.task('platforms:add', ['platform:add:ios', 'platform:add:android']);
gulp.task('platform:add:android', function () {
  execCCommand('platform add android');
});
gulp.task('platform:add:ios', function () {
  execCCommand('platform add ios');
});
gulp.task('platforms:rm', function () {
  if (!cPlatforms('rm'))
    console.log('No Platforms defined');
});

gulp.task('plugins:add', [], function () {
  if (!cPlugins('add'))
    console.log('plz configure some plugins');
});

gulp.task('plugins:rm', function () {
  if (!cPlugins('rm'))
    console.log('plz configure some plugins');
});

gulp.task('build:android', [], function () {
  execCCommand('build android');
});
gulp.task('release:android', [], function () {
  execCCommand('build android --release');
});

gulp.task('build:ios', [], function () {
  execCCommand('build ios');
});

gulp.task('help', function () {
  execCCommand('help');
});

gulp.task('plugins:list', function () {
  execCCommand('plugins -ls');
});

gulp.task('version', function () {
  execCCommand('-v');
});

gulp.task('run:android', function () {
  execCCommand('run android');
});

gulp.task('run:ios', [], function () {
  execCCommand('run ios');
});

gulp.task('prepare:ios', [], function () {
  execCCommand('prepare ios');
});

function cPlatforms(type) {
  var platforms = yoConfigJson['generator-m'].answers.platforms;
  if (platforms.length > 0) {
    platforms.forEach(function (platform) {
      var platformCmd = 'platform ' + type + ' ' + platform;
      execCCommand(platformCmd);
    });
  } else {
    return false;
  }
}

function cPlugins(type) {
  var CordovaPlugins = yoConfigJson['generator-m'].answers.plugins;
  if (CordovaPlugins.length > 0) {
    CordovaPlugins.forEach(function (plugin) {
      var platformCmd = 'plugin ' + type + ' ' + plugin;
      execCCommand(platformCmd);
    });
  } else {
    return false;
  }
}

function execCCommand(cCommand) {
  console.log(cCommand);
  var exec = process.platform === 'win32' ? 'cordova.cmd' : 'cordova';
  var cmd = path.resolve('./node_modules/cordova/bin', exec);
  var spawn = require('child_process').spawn;
  var curl = spawn(cmd, cCommand.split(' '));

  curl.stdout.on('data', function (data) {
    console.log('stdout: ' + data);
  });
  curl.stderr.on('data', function (data) {
    console.log('stderr: ' + data);
  });
  curl.on('exit', function (code, signal) {
    console.log('exit', code, signal);
  });
  curl.on('close', function (code) {
    console.log('child process exited with code ' + code);
  });
}
