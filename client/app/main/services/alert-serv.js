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
