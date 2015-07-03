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
 * @name messenger:Conversation
 * @description get and return the chat conversation from a user and a receiver
 * @requires RelutionLiveData
 */
angular.module('messenger')
  .service('Conversation', function Conversation(RelutionLiveData) {
    var self = this;
    /**
     * @ngdoc property
     * @name model
     * @description the Conversation model
     * @propertyOf messenger:Conversation
     */
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
    /**
     * @ngdoc property
     * @name collection
     * @description the Conversation collection
     * @propertyOf messenger:Conversation
     */
    this.collection = RelutionLiveData.Collection.extend({
      model: self.model
    });
  });
