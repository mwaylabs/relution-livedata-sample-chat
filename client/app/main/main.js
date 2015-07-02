'use strict';
angular.module('main', [])
  .filter('unsafe', function ($sce) {
    return $sce.trustAsHtml;
  });
