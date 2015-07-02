'use strict';
angular.module('translation', [
  'pascalprecht.translate',
  'ngCordova',
  'translation.service'
]);

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
 * @ngdoc service
 * @name translation:TranslationService
 * @description preload translations
 */
angular.module('translation.service', [])
  .service('TranslationService', function TranslationService($http, Config, $q, $localForage) {
    var self = this;
    /**
     * @ngdoc property
     * @name defaultTranslation
     * @description if there is a translation saved in storage
     * @propertyOf translation:TranslationService
     */
    this.defaultTranslation = Config.LANGUAGES[0];
    /**
     * @ngdoc property
     * @name folder
     * @description where the i18n folder is
     * @propertyOf translation:TranslationService
     */
    this.folder = Config.LANGUAGE_FILES_FOLDER;
    /**
     * @ngdoc property
     * @name languages
     * @description available languages
     * @propertyOf translation:TranslationService
     */
    this.languages = Config.LANGUAGES;
    /**
     * @ngdoc property
     * @name promises
     * @description promises for $http
     * @propertyOf translation:TranslationService
     */
    this.promises = [];
    /**
     * @ngdoc method
     * @name getPath
     * @description get the default key
     * @methodOf translation:TranslationService
     */
    this.getDefaultTranslationKey = function () {
      return $localForage.getItem(Config.LANGUAGE_STORE_DEFAULT_KEY);
    };
    /**
     * @ngdoc method
     * @name setDefaultTranslationKey
     * @description set the default key
     * @methodOf translation:TranslationService
     */
    this.setDefaultTranslationKey = function (key) {
      return $localForage.setItem(Config.LANGUAGE_STORE_DEFAULT_KEY,  key);
    };
    /**
     * @ngdoc method
     * @name getPath
     * @description retsurn the file path 'i18n/de.json'
     * @methodOf translation:TranslationService
     */
    this.getPath = function (prefix) {
      return self.folder + prefix + '.json';
    };
    /**
     * @ngdoc method
     * @name getJson
     * @description load a json by path
     * @methodOf translation:TranslationService
     */
    this.getJson = function (path) {
      return $http.get(path);
    };
    /**
     * @ngdoc method
     * @name promiseLanguage
     * @description prepare the promise in a array
     * @methodOf translation:TranslationService
     */
    this.promiseLanguage = function () {
      angular.forEach(self.languages, function (langPrefix) {
        self.promises.push(self.getJson(self.getPath(langPrefix)));
      });
      return self.promises;
    };
    /**
     * @ngdoc method
     * @name qAll
     * @description return all $http promises
     * @methodOf translation:TranslationService
     */
    this.qAll = function () {
      self.promiseLanguage();
      var promise = $q.all(self.promises);
      return promise.then(function (languages) {
        return {languages: self.languages, promises: languages};
      });
    };
  });

'use strict';
/**
 * @ngdoc directive
 * @restrict E
 * @requires $filter, Config, $translate
 * @description plz define in your config the following LANGUAGES: ['de-DE', 'en-IN'] and in your translation Files 'LANGUAGES' key
 * @example ````
 * <div class="list">
    <translation-select-item></translation-select-item>
  </div>
 ````
 * @name translation:TranslationSelectItem
 */
angular.module('translation')
  .directive('translationSelectItem', function TranslationSelectItem($filter, Config, $translate, TranslationService) {
    var postLink = function ($scope, $element) {
      $element.addClass('item item-input item-select');
      var self = this;
      /**
       * @ngdoc property
       * @name langSuffix
       * @description which language is in use
       * @propertyOf translation:TranslationSelectItem
       */
      var langSuffix = $translate.use();
      /**
       * @ngdoc method
       * @name getLanguageMenu
       * @description map a menu For the Select Box
       * @methodOf translation:TranslationSelectItem
       */
      this.getLanguageMenu = function () {
        var menu = [];
        angular.forEach(Config.LANGUAGES, function (language) {
          menu.push({
            value: language,
            label: $filter('translate')(language.toUpperCase())
          });
        });
        return menu;
      };
      /**
       * @ngdoc method
       * @name setSelectedLanguage
       * @description set the used language
       * @methodOf translation:TranslationSelectItem
       */
      this.setSelectedLanguage = function () {
        angular.forEach(self.languageMenu, function (item, key) {
          if (item.value === langSuffix) {
            self.use = self.languageMenu[key];
          }
        });
      };
      /**
       * @ngdoc method
       * @name changeLanguage
       * @description on select change
       * @methodOf translation:TranslationSelectItem
       */
      this.changeLanguage = function () {
        if (!angular.equals(langSuffix, self.use.value)) {
          $translate.use(self.use.value);
          TranslationService.setDefaultTranslationKey(self.use.value);
          langSuffix = self.use.value;
        }
      };
      /**
       * @ngdoc property
       * @name languageMenu
       * @description on select change
       * @propertyOf translation:TranslationSelectItem
       * @returns {object} {value: 'de-DE', label: 'Deutsch'}
       */
      this.languageMenu = this.getLanguageMenu();
      /**
       * set the language to the model
       */
      this.setSelectedLanguage();
    };
    return {
      template: '<div class="input-label">{{"LANGUAGE"|translate}} </div><select ng-change="translationSelectItemDir.changeLanguage()" ng-model="translationSelectItemDir.use" ng-options="opt as opt.label for opt in translationSelectItemDir.languageMenu"></select>',
      restrict: 'E',
      controllerAs: 'translationSelectItemDir',
      bindToController: true,
      controller: postLink
    };
  });

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
  .service('UserMessengerService', function UserMessengerService($filter, $rootScope, $state, RelutionLiveData, Config, AlertService, UserService) {
    var self = this;
    this.currentUser = null;
    this.conversationsUser = null;
    //https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
    this.filterByUuid = function (obj) {
      if ('attributes' in obj && obj.attributes.uuid === this) {
        return obj.attributes;
      }
      return false;
    };

    this.getUserByUuid = function (uuid) {
      var user = this.conversationsUser.filter(self.filterByUuid, uuid);
      return user[0].attributes;
    };

    this.handleError = function (model, error) {
      // eventually an xhr response was incorrectly passed instead of an error
      if (error && !error.message && error.responseJSON && error.responseJSON.error) {
        error = error.responseJSON.error;
      }

      // extract viable information, model and/or error may be undefined/null
      var objectId = model && model.attributes && model.attributes.header && model.attributes.header.objectId;
      var message = error && error.message;
      if (typeof message === 'string') {
        // strip off potential server-side JavaScript stack trace
        var strip = message.lastIndexOf('-- ');
        if (strip >= 0) {
          message = message.substring(0, strip);
        }
        // replace new-lines with HTML line breaks
        var index = -1;
        while (index < message.length && (index = message.indexOf('\n', index + 1)) > 0) {
          message = message.substring(0, index) + '<br />' + message.substring(index + 1);
        }
      }

      // show an error popup
      AlertService.map({
        cssClass: 'assertive',
        title: objectId || $filter('translate')('ERROR_ON_PATCH_APPROVAL_TITLE'),
        message: message || $filter('translate')('ERROR_ON_PATCH_APPROVAL'),
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-positive'
          }
        ]
      });
    };
    this.model = RelutionLiveData.Model.extend({
      idAttribute: 'uuid'
    });

    this.collection = RelutionLiveData.Collection.extend({
      model: self.model,
      url: Config.ENV.SERVER_URL + Config.SERVER_API_PATH + Config.MESSENGER_USERS_URL
    });

    this.fetch = function () {
      if (!this.conversationsUser) {
        this.conversationsUser = new this.collection();
        this.currentUser = UserService.getUser();
        return self.conversationsUser.fetch().then(function (res) {
          return res;
        });
      }
      return self.conversationsUser;
    };
  });

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
  .service('MessageService', function MessageService($filter, $rootScope, $localForage, RelutionLiveData, Config, AlertService, LoginService) {
    var self = this;
    this.audioMessage = {
      on: true
    };
    this.collectionType = null;
    this.collection = null;
    this.handleError = function (model, error) {
      // eventually an xhr response was incorrectly passed instead of an error
      if (error && !error.message && error.responseJSON && error.responseJSON.error) {
        error = error.responseJSON.error;
      }

      // extract viable information, model and/or error may be undefined/null
      var objectId = model && model.attributes && model.attributes.header && model.attributes.header.objectId;
      var message = error && error.message;
      if (typeof message === 'string') {
        // strip off potential server-side JavaScript stack trace
        var strip = message.lastIndexOf('-- ');
        if (strip >= 0) {
          message = message.substring(0, strip);
        }
        // replace new-lines with HTML line breaks
        var index = -1;
        while (index < message.length && (index = message.indexOf('\n', index + 1)) > 0) {
          message = message.substring(0, index) + '<br />' + message.substring(index + 1);
        }
      }
      // show an error popup
      AlertService.map({
        cssClass: 'assertive',
        title: objectId || $filter('translate')('ERROR_ON_PATCH_APPROVAL_TITLE'),
        message: message || $filter('translate')('ERROR_ON_PATCH_APPROVAL'),
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-positive'
          }
        ]
      });
    };

    this.getAudioMessageSetting = function () {
      return $localForage.getItem(Config.MESSENGER_SETTINGS_AUDIO).then(function (setting) {
        if (setting === undefined || setting === null) {
          self.audioMessage.on = true;
          return self.audioMessage.on;
        }
        self.audioMessage.on = setting;
        return self.audioMessage.on;
      });
    };
    this.setAudioMessageSetting = function (setting) {
      return $localForage.setItem(Config.MESSENGER_SETTINGS_AUDIO, setting).then(function (res) {
        if (res === undefined || res === null) {
          self.audioMessage.on = true;
          return self.audioMessage.on;
        }
        self.audioMessage.on = setting;
        return self.audioMessage.on;
      });
    };

    this.fetch = function () {
      this.getAudioMessageSetting();
      this.liveDataStore = new RelutionLiveData.SyncStore({
          useLocalStore: true,
          useSocketNotify: true,
          credentials: {
            username: LoginService.form.username.value,
            password: LoginService.form.password.value
          },
          error: self.handleError.bind(self)
        }
      );

      this.modelType = RelutionLiveData.Model.extend({
        idAttribute: '_id',
        parse: function (resp) {
          if (resp && resp.date) {
            try {
              resp.dateFormated = RelutionLiveData.Date.create(resp.date).format('DD.MM. hh:mm');
            } catch (e) {
              resp.dateFormated = resp.date;
            }
          }
          return RelutionLiveData.Model.prototype.parse.apply(this, arguments);
        }
      });

      this.collectionType = RelutionLiveData.Collection.extend({
        store: self.liveDataStore,
        entity: 'messages',
        model: self.modelType,
        url: Config.ENV.SERVER_URL + Config.SERVER_API_PATH + Config.MESSENGER_URL
      });

      this.collection = new this.collectionType();
      //var options = {};
      return this.collection.fetch().then(function (res) {
        return res;
      });
    };
  });

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
  .service('Conversation', function (RelutionLiveData) {
    var self = this;
    this.model = RelutionLiveData.Model.extend({
      idAttribute: 'id',
      parse: function (resp) {
        if (resp && resp.date) {
          try {
            resp.dateFormated = RelutionLiveData.Date.create(resp.date).format('DD.MM. hh:mm');
          } catch (e) {
            resp.dateFormated = resp.date;
          }
        }
        return RelutionLiveData.Model.prototype.parse.apply(this, arguments);
      }
    });
    this.collection = RelutionLiveData.Collection.extend({
      model: self.model
    });
  });

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
  .controller('MessagesCtrl', function MessagesCtrl($scope, UserMessengerService, MessageService, $q, $state, LoginService) {
    var self = this;
    this.media = {
      on: true
    };
    this.service = UserMessengerService;
    this.users = [];
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

'use strict';
angular.module('main', [])
  .filter('unsafe', function ($sce) {
    return $sce.trustAsHtml;
  });

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
angular.module('main')
  .factory('RelutionLiveData',
  function RelutionLiveData($window) {
    $window.Relution.setDebug(true);
    return $window.Relution.LiveData;
  }
);

'use strict';
/**
 * @ngdoc service
 * @name main:AlertService
 * @description add your description
 */
angular.module('main')
  .service('AlertService', function AlertService($ionicPopup) {
    //console.log('Hello from your Service: Alert in module main');
    var self = this;
    this.title = 'Alert';
    this.message = 'Hello Alert';
    this.cssClass = 'balanced';
    this.subtitle = null;
    this.template = '<div>' + this.message + '</div>';
    this.buttons = [];
    this.alert = function () {
      $ionicPopup.alert({
        cssClass: self.cssClass,
        title: self.title,
        subTitle: self.subtitle,
        template: self.template,
        buttons: self.buttons
      });
    };
    this.map = function (vo) {
      self.title = vo.title ? vo.title : self.title;
      self.message = vo.message ? vo.message : self.message;
      self.template = '<div>' + self.message + '</div>';
      self.cssClass = vo.cssClass ? vo.cssClass : self.cssClass;
      self.subtitle = vo.subtitle ? vo.subtitle : self.subtitle;
      self.template = vo.template ? vo.template : self.template;
      self.buttons = vo.buttons ? vo.buttons : self.buttons;
      self.alert();
    };
  });

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

'use strict';
angular.module('main')
  .constant('Config', {
    ENV: {
      /*inject-env*/
      'SERVER_URL': 'http://10.21.4.130:8080'
      /*endinject*/
    },
    SERVER_API_PATH: '/mway/chat-sample/api',
    MOVIES_URL: '/movies',
    MESSENGER_URL: '/messages',
    MESSENGER_USERS_URL: '/users',
    MESSENGER_USER_URL: '/user',
    MESSENGER_SETTINGS_AUDIO: 'messenger_audio',
    CURRENT_AUTHORIZATION_LOGIN: '/gofer/security/rest/auth/login',
    CURRENT_AUTHORIZATION_LOGOUT: '/gofer/security-logout',
    RELUTION_SESSION_ID_KEY: 'JSESSIONID',
    LANGUAGES: ['de-DE', 'en-IN'],
    LANGUAGE_FILES_FOLDER: 'translation/assets/i18n/',
    LANGUAGE_STORE_DEFAULT_KEY: 'approval-translation',
    BOWER_DEPENDENCIES: [
      {name: 'ionic', version: ionic.version},
      {name: 'angular', version: angular.version.full},
      {name: 'bikini', version: Relution.LiveData.Version},
      'angular-animate',
      'angular-sanitize',
      'angular-ui-router',
      'ngCordova',
      'angular-translate',
      'angular-localForage',
      'angular-deferred-bootstrap',
      'relution-client-security'
    ]
  });

'use strict';
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
(function (angular, localforage, deferredBootstrapper) {
  /**
   * Bootstrap your applicatin on device ready if is device defined
   * @constructor
   */
  var CordovaInit = function () {
    /**
     * Device is ready
     */
    var onDeviceReady = function () {
      receivedEvent('deviceready');
    };
    /**
     * @param {event} event
     */
    var receivedEvent = function () {
      deferredBootstrapper.bootstrap({
        element: document.querySelector('body'),
        module: 'relutionLiveData',
        injectorModules: [
          'ionic',
          'LocalForageModule',
          'ui.router',
          'ngCordova',
          'pascalprecht.translate',
          'main',
          'translation',
          'translation.service'
        ],
        resolve: {
          languages: ['Config', '$q', '$localForage', 'TranslationService',
            function (Config, $q, $localForage, TranslationService) {
              return TranslationService.qAll();
            }],
          languageDefault: ['TranslationService',
            function (TranslationService) {
              return TranslationService.getDefaultTranslationKey().then(function (key) {
                if (!key) {
                  TranslationService.setDefaultTranslationKey('en-IN');
                  return 'en-IN';
                }
                return key;
              });
            }]
        }
      });
    };
    /**
     * add the eventlistener
     */
    this.bindEvents = function () {
      document.addEventListener('deviceready', onDeviceReady, false);
    };
    //If cordova is present, wait for it to initialize, otherwise just try to
    //bootstrap the application.
    if (window.cordova !== undefined) {
      this.bindEvents();
    } else {
      receivedEvent('manual');
    }
  };
  document.addEventListener('DOMContentLoaded', function () {
    new CordovaInit();
  });
}(window.angular, localforage, window.deferredBootstrapper));

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
        //,
        //resolve: {
        //  login: function ($q, LoginService) {
        //    LoginService.setUsername('pascal');
        //    LoginService.setPassword('hallo1234');
        //    return $q.when(LoginService.logon());
        //  }
        //}
      });
  });

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
 * @name auth:LoginCtrl
 * @requires $scope
 * @description add your description
 */
angular.module('auth')
  .controller('LoginCtrl', function LoginCtrl($scope, $state, $filter, LoginService, AlertService, $relutionSecurityConfig) {
    var self = this;
    this.loader = {
      //loadingIcon: ionic.Platform.isAndroid() ? 'android' : 'ios',
      cssClass: 'balanced',
      loadingIcon: 'ripple',
      onLoad: false,
      toggle: function () {
        self.loader.onLoad = !self.loader.onLoad;
      }
    };
    this.service = LoginService;
    this.getMessage = function (errors) {
      var message = 'Please check following Fields: ';
      angular.forEach(errors, function (error) {
        message += error.$name + ' ';
      });
      return message;
    };
    this.alert = function (title, message) {
      AlertService.map({
        cssClass: 'assertive',
        title: title,
        message: message,
        buttons: [
          {
            text: $filter('translate')('CLOSE'),
            type: 'button-calm'
          }
        ]
      });
    };
    this.submit = function (loginform) {
      if (loginform.$valid) {
        if (self.loader.cssClass !== 'error') {
          self.loader.toggle();
          self.loader.cssClass !== 'balanced';
        }
        this.service.logon()
          .success(function () {
            self.loader.toggle();
            self.loader.cssClass !== 'balanced';
          })
          .error(function (e) {
            self.loader.cssClass = 'error';
            if (e.status === 0) {
              self.alert('Following Errors Occured', 'please check your Internet Connection');
            }
            if (e.status === 403 || e.status === 401) {
              self.alert('Following Errors Occured', 'User not exist');
            }
            if (e.status === 404) {
              self.alert('Following Errors Occured', 'This Url is not available');
            }
          });
      } else {
        AlertService.map({
          cssClass: 'assertive',
          title: 'Following Errors Occured',
          message: self.getMessage(loginform.$error.required),
          buttons: [
            {
              text: $filter('translate')('CLOSE'),
              type: 'button-positive'
            }
          ]
        });
      }
    };
    $scope.$on('$ionicView.afterEnter', function () {
      self.icons = $relutionSecurityConfig.iconSet;
      self.include = $relutionSecurityConfig.view;
    });
  });

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
