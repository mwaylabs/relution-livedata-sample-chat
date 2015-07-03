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
 * @name messenger:ChatCtrl
 * @requires $scope
 * @requires $stateParams
 * @requires $q
 * @requires $timeout
 * @requires $ionicScrollDelegate
 * @requires $rootScope
 * @requires $filter
 * @requires $ionicLoading
 * @requires $state
 * @requires $window
 * @requires main:Config
 * @requires messenger:UserMessengerService
 * @requires messenger:MessageService
 * @requires RelutionLiveData
 * @requires main:AlertService
 * @requires LoginService
 */
angular.module('messenger')
  .controller('ChatCtrl', function ChatCtrl($scope, $stateParams, $q, $timeout, $ionicScrollDelegate, $rootScope, $filter, $ionicLoading, $state, $window, Config, UserMessengerService, MessageService, RelutionLiveData, AlertService, LoginService) {
    var self = this;
    /**
     * @ngdoc property
     * @name _LIST
     * @description the delegat-handle for the list
     * @propertyOf messenger:ChatCtrl
     */
    var _LIST = 'chat-list';
    /**
     * @ngdoc property
     * @name messages
     * @description available Messages
     * @propertyOf messenger:ChatCtrl
     */
    this.messages = null;
    /**
     * @ngdoc property
     * @name form
     * @description bottom input field
     * @propertyOf messenger:ChatCtrl
     */
    this.form = {
      message: null
    };
    /**
     * @ngdoc property
     * @name sender
     * @description the chat user that wil be send
     * @propertyOf messenger:ChatCtrl
     */
    this.sender = null;
    /**
     * @ngdoc property
     * @name receiver
     * @description receiver chat partner
     * @propertyOf messenger:ChatCtrl
     */
    this.receiver = null;
    /**
     * @ngdoc method
     * @name mediaPlay
     * @description checks user audio settings and play a dong
     * @methodOf messenger:ChatCtrl
     */
    this.mediaPlay = function () {
      MessageService.getAudioMessageSetting().then(function (setting) {
        if (self.media && setting) {
          self.media.play();
        }
      });
    };
    /**
     * @ngdoc method
     * @name gongMessage
     * @description load the mp3 from a server
     * @methodOf messenger:ChatCtrl
     */
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
    /**
     * @ngdoc method
     * @name gongMessage
     * @description remove a js script from the chat
     * @methodOf messenger:ChatCtrl
     */
    var strippedString = function (originalString) {
      return originalString.replace(/<.*?script.*?>.*?<\/.*?script.*?>/igm, '');
    };
    /**
     * @ngdoc method
     * @name errorOnMessage
     * @description something get wrong on save model
     * @methodOf messenger:ChatCtrl
     */
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
    /**
     * @ngdoc method
     * @name addMessage
     * @description add a message from the sender
     * @methodOf messenger:ChatCtrl
     */
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
      //add a new Model to the Message Collection
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
    //filtered chat messages from other users
    $scope.filterMessages = function (obj) {
      if ('attributes' in obj && obj.attributes.senderUuid === self.sender.uuid && obj.attributes.receiverUuid === self.receiver.uuid || 'attributes' in obj && obj.attributes.senderUuid === self.receiver.uuid && obj.attributes.receiverUuid === self.sender.uuid) {
        return true;
      }
      return false;
    };
    /**
     * @ngdoc method
     * @name changeRead
     * @description if the sender see the receiver messages it will be toggle state isRead to true
     * @methodOf messenger:ChatCtrl
     */
    this.changeRead = function () {
      angular.forEach(self.messages, function (model) {
        if (model.get('senderUuid') !== self.sender.uuid && !model.get('isRead')) {
          model.set('isRead', true).save();
        }
      });
      $rootScope.$applyAsync();
    };
    /**
     * @ngdoc method
     * @name debug
     * @description debugging Collection
     * @methodOf messenger:ChatCtrl
     */
    this.debug = function () {
      console.log('sender', this.sender);
      console.log('receiver', this.receiver);
      angular.forEach(MessageService.collection.models, function (model, i) {
        console.log(model.attributes, i);
      });
    };
    /**
     * @ngdoc method
     * @name scrollBottom
     * @description scroll to bottom after start, add etc ..
     * @methodOf messenger:ChatCtrl
     */
    this.scrollBottom = function () {
      console.log('try to scroll down');
      $ionicScrollDelegate.$getByHandle(_LIST).scrollBottom(true);
    };
    /**
     * @ngdoc method
     * @name _addEventListener
     * @description some events on the Message Collection
     * @methodOf messenger:ChatCtrl
     */
    var _addEventListener = function () {
      MessageService.collection.on('remove', function (model) {
        RelutionLiveData.Debug.info('remove');
        RelutionLiveData.Debug.warning(JSON.stringify(model));
        $rootScope.$applyAsync();
      });
      MessageService.collection.on('add', function (model) {
        //self.mediaPlay();
        RelutionLiveData.Debug.info('add');
        RelutionLiveData.Debug.warning(JSON.stringify(model));
        $timeout(self.scrollBottom, 500);
        $rootScope.$applyAsync();

      });
      MessageService.collection.on('set', function (model) {
        RelutionLiveData.Debug.info('set');
        RelutionLiveData.Debug.warning(JSON.stringify(model));
        $rootScope.$applyAsync();
      });
      MessageService.collection.on('sync', function (res) {
        RelutionLiveData.Debug.info('sync');
        RelutionLiveData.Debug.warning(JSON.stringify(res));
        self.messages = MessageService.collection.models;
        self.changeRead();
      });
      MessageService.collection.on('change', function () {
        //console.log('change', self.collection.models);
        $rootScope.$applyAsync();
      });
      $timeout(self.scrollBottom, 500);
    };
    //User is not logged in transition to login
    $scope.$on('$ionicView.beforeEnter', function () {
      if (!LoginService.isLoggedIn) {
        return $state.go('auth.login');
      }
    });
    //activate sound
    $scope.$on('$ionicView.afterEnter', function () {
      //console.log('after Enter');
      //if ($window.cordova) {
      //  //self.gongMessage();
      //}
    });
    //fetch chat messages
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
