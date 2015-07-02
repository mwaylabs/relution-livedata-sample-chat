'use strict';
/**
 * @ngdoc directive
 * @restrict E
 * @requires
 * @name main:hourGlassLoader
 */
angular.module('main')
.directive('hourGlassLoader', function () {
  return {
    templateUrl: 'main/temoplates/directives/hourglass.html',
    restrict: 'E',
    link: function postLink (scope, element, attrs) {
      element.text('this is the myDirective directive', attrs);
    }
  };
});
