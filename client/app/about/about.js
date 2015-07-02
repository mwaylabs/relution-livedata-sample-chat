'use strict';
angular.module('about', [])
  .config(function ($stateProvider) {
    $stateProvider
      .state('tab.about', {
        parent: 'tab',
        url: '/about',
        views: {
          'tab-about': {
            templateUrl:  ionic.Platform.isAndroid() ? 'about/templates/about-android.html' : 'about/templates/about.html',
            controller: 'AboutCtrl as aboutC'
          }
        }
      });
  });
