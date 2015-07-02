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
angular.module('messenger')
  .controller('ChatCtrl', function ChatCtrl($scope, $stateParams, $q, $timeout, $ionicScrollDelegate, $rootScope, $filter, $ionicLoading, $state, $cordovaMedia, $window, Config, UserMessengerService, MessageService, RelutionLiveData, AlertService, LoginService) {
    var self = this;
    var _LIST = 'chat-list';
    this.messages = null;
    this.form = {
      message: null
    };
    this.sender = null;
    this.receiver = null;
    this.mediaPlay = function () {
      MessageService.getAudioMessageSetting().then(function (setting) {
        if (self.media && setting) {
          self.media.play();
        }
      });
    };
    this.gongMessage = function () {
      self.media = new Media(Config.ENV.SERVER_URL + '/mway/chat-sample/messenger/assets/audio/doorbell.mp3', function (result) {
        RelutionLiveData.Debug.trace('success', result);
      }, function (e) {
        RelutionLiveData.Debug.error('file failed');
        RelutionLiveData.Debug.error(e);
      }, function (status) {
        RelutionLiveData.Debug.trace('status', status);
      });
    };
    //dependency injection javascript
    var strippedString = function (originalString) {
      return originalString.replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, '');
    };
    this.errorOnMessage = function () {
      AlertService.map({
        cssClass: 'calm',
        title: 'Error on save Message',
        message: 'please try again!',
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-calm'
          }
        ]
      });
    };
    this.addMessage = function (form) {
      if (!form.$valid) {
        self.errorOnMessage();
        return false;
      }
      var message = strippedString(self.form.message);
      if (message.length <= 0) {
        self.form.message = '';
        self.errorOnMessage();
        return false;
      }
      MessageService.collection.create({
          'senderName': self.sender.username,
          'senderUuid': self.sender.uuid,
          'receiverName': self.receiver.username,
          'receiverUuid': self.receiver.uuid,
          'date': new Date(),
          'message': message,
          'dateFormated': RelutionLiveData.Date.create().format('DD.MM. hh:mm'),
          'isRead': false,
          'aclEntries': [self.sender.uuid + ':rw', self.receiver.uuid + ':rw']
        },
        {
          success: function () {
            self.form.message = '';
          },
          error: function (res, err, options) {
            RelutionLiveData.Debug.trace(res);
            RelutionLiveData.Debug.trace(err);
            RelutionLiveData.Debug.trace(options);
          }
        }
      );
    };
    $scope.filterMessages = function (obj) {
      if ('attributes' in obj && obj.attributes.senderUuid === self.sender.uuid && obj.attributes.receiverUuid === self.receiver.uuid || 'attributes' in obj && obj.attributes.senderUuid === self.receiver.uuid && obj.attributes.receiverUuid === self.sender.uuid) {
        return true;
      }
      return false;
    };
    this.changeRead = function () {
      angular.forEach(self.messages, function (model) {
        console.log(model.get('senderUuid'), self.sender.uuid, model.get('isRead'));
        if (model.get('senderUuid') !== self.sender.uuid && !model.get('isRead')) {
          model.set('isRead', true).save();
        }
      });
      $rootScope.$applyAsync();
    };
    this.debug = function () {
      console.log('sender', this.sender);
      console.log('receiver', this.receiver);
      angular.forEach(MessageService.collection.models, function (model, i) {
        console.log(model.attributes, i);
      });
    };
    this.scrollBottom = function () {
      console.log('try to scroll down');
      $ionicScrollDelegate.$getByHandle(_LIST).scrollBottom(true);
    };
    var _addEventListener = function () {
      MessageService.collection.on('remove', function () {
        console.log('remove');
        $rootScope.$applyAsync();
      });
      MessageService.collection.on('add', function (er) {
        console.log('add', er);
        self.mediaPlay();
        $timeout(self.scrollBottom, 500);
        $rootScope.$applyAsync();

      });
      MessageService.collection.on('set', function () {
        console.log('set');
        $rootScope.$applyAsync();
      });
      MessageService.collection.on('sync', function () {
        console.log('sync controller');
        self.messages = MessageService.collection.models;
        self.changeRead();
      });
      MessageService.collection.on('change', function () {
        //console.log('change', self.collection.models);
        $rootScope.$applyAsync();
      });
      $timeout(self.scrollBottom, 500);
    };

    $scope.$on('$ionicView.beforeEnter', function () {
      if (!LoginService.isLoggedIn) {
        return $state.go('auth.login');
      }
    });
    $scope.$on('$ionicView.afterEnter', function () {
      console.log('after Enter');
      if ($window.cordova) {
        self.gongMessage();
      }
    });
    $scope.$on('$ionicView.enter', function () {
      if (LoginService.isLoggedIn) {
        self.sender = UserMessengerService.currentUser;
        self.receiver = UserMessengerService.getUserByUuid($stateParams.uuid);
        $q.when(MessageService.fetch()).then(function () {
          self.messages = MessageService.collection.models;
          _addEventListener();
          self.changeRead();
        });
      }
    });
  });
