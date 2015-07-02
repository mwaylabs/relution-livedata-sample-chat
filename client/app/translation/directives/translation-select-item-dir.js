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
