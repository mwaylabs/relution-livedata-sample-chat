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
