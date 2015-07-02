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
