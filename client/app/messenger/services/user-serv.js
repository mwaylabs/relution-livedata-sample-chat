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
 * @name messenger:UserMessengerService
 * @description get the available Chat partner for your user
 * @requires $filter
 * @requires $rootScope
 * @requires $state
 * @requires RelutionLiveData
 * @requires main:Config
 * @requires main:AlertService
 * @requires UserService
 */
angular.module('messenger')
  .service('UserMessengerService', function UserMessengerService($filter, $rootScope, $state, RelutionLiveData, Config, AlertService, UserService) {
    var self = this;
    /**
     * @ngdoc property
     * @name currentUser
     * @description the loggedin user
     * @propertyOf messenger:UserMessengerService
     */
    this.currentUser = null;
    /**
     * @ngdoc property
     * @name conversationsUser
     * @description the available other Group users
     * @propertyOf messenger:UserMessengerService
     */
    this.conversationsUser = null;

    /**
     * @ngdoc property
     * @name filterByUuid
     * @description filter a user by uuid https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
     * @propertyOf messenger:UserMessengerService
     */
    this.filterByUuid = function (obj) {
      if ('attributes' in obj && obj.attributes.uuid === this) {
        return obj.attributes;
      }
      return false;
    };
    /**
     * @ngdoc property
     * @name getUserByUuid
     * @description return a user by uuid
     * @propertyOf messenger:UserMessengerService
     */
    this.getUserByUuid = function (uuid) {
      var user = this.conversationsUser.filter(self.filterByUuid, uuid);
      return user[0].attributes;
    };
    /**
     * @ngdoc property
     * @name handleError
     * @description error on get users
     * @propertyOf messenger:UserMessengerService
     */
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
    /**
     * @ngdoc property
     * @name model
     * @description the user Model
     * @propertyOf messenger:UserMessengerService
     */
    this.model = RelutionLiveData.Model.extend({
      idAttribute: 'uuid'
    });
    /**
     * @ngdoc property
     * @name collection
     * @description the collectionType of user Models
     * @propertyOf messenger:UserMessengerService
     */
    this.collection = RelutionLiveData.Collection.extend({
      model: self.model,
      url: Config.ENV.SERVER_URL + Config.SERVER_API_PATH + Config.MESSENGER_USERS_URL
    });
    /**
     * @ngdoc property
     * @name fetch
     * @description get all users
     * @propertyOf messenger:UserMessengerService
     */
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
