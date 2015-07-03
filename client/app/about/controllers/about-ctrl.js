/**
 * Created by Pascal Brewing
 * Copyright (c)
 * 2015
 * M-Way Solutions GmbH. All rights reserved.
 * http://www.mwaysolutions.com
 * Redistribution and use in source and binary forms, with or without
 * modification, are not permitted.
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 * FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 * LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */
'use strict';
/**
 * @ngdoc controller
 * @name about:StartCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('about')
  .controller('AboutCtrl', function AboutCtrl($scope, $window, $rootScope, $cordovaAppVersion, $ionicLoading, Config) {
    var self = this;
    this.bowerPackages = Config.BOWER_DEPENDENCIES;
    this.browser = function (url) {

      $window.webview.openWebView(
        function () {

        },
        function () {

        },
        {
        iconColor: '#5394CA',
        backgroundColor: '#ffffff',
        isPDF: false,
        url: url,
        visibleAddress: false,
        editableAddress: false,
        icons: {
          backward: true,
          forward: true,
          refresh: true
        }
      });
    };
    $scope.$on('$ionicView.enter', function () {
      $ionicLoading.hide();
      $rootScope.$broadcast('show-content');
      if ($window.cordova) {
        $cordovaAppVersion.getAppVersion().then(function (version) {
          self.appVersion = version;
        });
      } else {
        self.appVersion = '0.0.1-dev';
      }
    });
  });
