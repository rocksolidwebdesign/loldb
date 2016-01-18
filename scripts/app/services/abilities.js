var _ = require('underscore');
var $ = require('jquery');
var Q = require('q');
var settings = require('app/settings');

var AbilityService = {
  fetch: function() {
    var deferred = Q.defer();
    var url = settings.apiUrl+'/api/abilities';

    $.ajax(url, {
      success: function(jsonResponse, textStatus, jqXHR) {
        deferred.resolve(jsonResponse);
      },
      error: function(jqXHR, textStatus, errorMsg) {
        deferred.reject(jqXHR);
      }
    });

    return deferred.promise;
  }
};

module.exports = AbilityService;
