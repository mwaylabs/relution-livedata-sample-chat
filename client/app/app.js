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
angular.module('relutionLiveData', [
  'ionic',
  'ui.router',
  'ngAnimate',
  'LocalForageModule',
  'ngCordova',
  'pascalprecht.translate',
  'translation',
  'translation.service',
  'relutionClientSecurity',
  'auth',
  'main',
  'about',
  'messenger'
])
  .run(function ($ionicPlatform, $window) {
    $ionicPlatform.ready(function () {
      if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if ($window.StatusBar) {
        $window.StatusBar.styleLightContent();
      }
    });
  })
  .config(function ($translateProvider, languages, languageDefault) {
    angular.forEach(languages.languages, function (prefix, index) {
      $translateProvider.translations(prefix, languages.promises[index].data);
    });
    $translateProvider.preferredLanguage(languageDefault);
  })
  .constant('$ionicLoadingConfig', {
    templateUrl: 'main/templates/directives/hourglass.html'
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('tab', {
        url: '/tab',
        abstract: true,
        templateUrl: 'main/templates/tabs.html',
        resolve: {
          'isLoggedIn': function (LoginService, $state, $q) {
            if (LoginService.sessionId === null) {
              return $q.when($state.go('auth.login'));
            }
            return $q.when(true);
          }
        }
      });
    $urlRouterProvider.otherwise('auth/login');
  })
  .config(function ($ionicConfigProvider) {
    if (ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(false);
    }
    //$ionicConfigProvider.tabs.position('bottom');
    $ionicConfigProvider.views.forwardCache(true);
  });
