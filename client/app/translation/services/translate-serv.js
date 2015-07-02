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
