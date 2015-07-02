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
