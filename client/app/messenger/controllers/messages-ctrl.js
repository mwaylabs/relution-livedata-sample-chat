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
 * @name messenger:MessagesCtrl
 * @requires $scope
 * @requires $q
 * @requires $state
 * @requires UserMessengerService
 * @requires MessageService
 * @requires LoginService
 */
angular.module('messenger')
  .controller('MessagesCtrl', function MessagesCtrl($scope, UserMessengerService, MessageService, $q, $state, LoginService) {
    var self = this;
    /**
     * @ngdoc property
     * @name media
     * @description toggle media settings
     * @propertyOf messenger:MessagesCtrl
     */
    this.media = {
      on: true
    };
    /**
     * @ngdoc property
     * @name media
     * @description service to get GroupUsers for chatting
     * @propertyOf messenger:MessagesCtrl
     */
    this.service = UserMessengerService;
    /**
     * @ngdoc property
     * @name users
     * @description all available Users fo chatting
     * @propertyOf messenger:MessagesCtrl
     */
    this.users = [];
    /**
     * @ngdoc method
     * @name changeAudioSetting
     * @description still not ready but wil be send a sound when message is inocming
     * @methodOf messenger:MessagesCtrl
     */
    this.changeAudioSetting = function () {
      return MessageService.setAudioMessageSetting(self.media.on);
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      if (!LoginService.isLoggedIn) {
        return $state.go('auth.login');
      }
    });
    $scope.$on('$ionicView.enter', function () {
      if (LoginService.isLoggedIn) {
        $q.when(self.service.fetch()).then(function () {
          self.media = {
            on: MessageService.audioMessage.on
          };
          self.users = UserMessengerService.conversationsUser.models;
        });
      }
    });
  });
