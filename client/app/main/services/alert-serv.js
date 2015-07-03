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
