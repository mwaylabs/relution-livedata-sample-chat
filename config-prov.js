/**
 * Created by pascalbrewing on 24/06/15
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
angular.module('auth')
  .provider('$relutionAuthLauncher', function() {
    var provider = this;
    provider.icons = [
      {
        android: {
          submit: 'ion-android-send',
          username: 'ion-android-person',
          password: '',
          organization: '',
          logout: ''
        },
        ios: {
          submit: '',
          username: '',
          password: '',
          organization: '',
          logout: ''
        }
      }
    ];
    provider.formViews = {
      PLACEHOLDER_LABELS: 'placeholder_form.html',
      INLINE_LABELS: 'inline_labels.html',
      STACKED_LABELS: 'stacked_labels.html',
      FLOATING_LABELS: 'floating_labels.html',
      INSET_FORMS: 'inset_form.html',
      INSET_INPUTS: 'inset_inputs.html',
      INPUT_ICONS: 'input_icons.html'
    };
    provider.setLayoutStyle = function (key) {
      return provider.view = provider.formViews[key];
    };
    provider.setLayoutStyle(provider.formViews.PLACEHOLDER_LABELS);
    provider.$get = function () {
      return provider;
    };
  });
