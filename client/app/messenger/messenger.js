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
 * @name messenger
 * @description the messenger module
 */
angular.module('messenger', ['main'])
  .config(function ($stateProvider) {
    $stateProvider
      .state('tab.messenger', {
        parent: 'tab',
        url: '/chat',
        //resolve: {
        //  //have to be removed is only for development
        //  'login': function (LoginService, $q) {
        //    LoginService.setUsername('pascal');
        //    LoginService.setPassword('hallo1234');
        //    return $q.when(LoginService.logon());
        //  }
        //},
        views: {
          'tab-messenger': {
            templateUrl: 'messenger/templates/messages.html',
            controller: 'MessagesCtrl as messengerC'
          }
        }
      })
      .state('tab.chat', {
        parent: 'tab',
        url: '/channel/:uuid',
        views: {
          'tab-messenger': {
            templateUrl: 'messenger/templates/chat.html',
            controller: 'ChatCtrl as chatC'
          }
        }
      });
  });
