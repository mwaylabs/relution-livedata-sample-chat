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
 * @ngdoc interface
 * @name auth
 * @description the auth module
 */
angular.module('auth', ['main', 'relutionClientSecurity'])
  .config(function ($stateProvider, $relutionSecurityConfigProvider, Config) {
    $relutionSecurityConfigProvider.setLayoutStyle('INPUT_ICONS');
    $relutionSecurityConfigProvider.setIcons();
    $relutionSecurityConfigProvider.forwardStateAfterLogin = 'tab.messenger';
    $relutionSecurityConfigProvider.forwardStateAfterLogout = 'auth.login';
    $relutionSecurityConfigProvider.loginUrl = Config.ENV.SERVER_URL + Config.CURRENT_AUTHORIZATION_LOGIN;
    $relutionSecurityConfigProvider.logoutUrl = Config.ENV.SERVER_URL + Config.CURRENT_AUTHORIZATION_LOGOUT;
    $stateProvider
      .state('auth', {
        url: '/auth',
        abstract: true,
        template: '<ion-nav-view name="auth"></ion-nav-view>'
      })
      .state('auth.login', {
        parent: 'auth',
        url: '/login',
        views: {
          'auth': {
            templateUrl: 'auth/templates/login/index.html',
            controller: 'LoginCtrl as loginC'
          }
        }
      });
  });
