var _ = require('underscore');
var $ = require('jquery');
var Q = require('q');
var settings = require('app/settings');

var ChampionService = {
  fetch: function() {
    var deferred = Q.defer();
    var url = settings.apiUrl+'/api/champions';

    $.ajax(url, {
      success: function(jsonResponse, textStatus, jqXHR) {
        var champions, list, keys;

        keys = Object.keys(jsonResponse.data);
        list = jsonResponse.data;

        champions = _(keys).map(function(key) {
          return list[key];
        });

        deferred.resolve(champions);
      },
      error: function(jqXHR, textStatus, errorMsg) {
        deferred.reject(jqXHR);
      }
    });

    return deferred.promise;
  }
};

module.exports = ChampionService;
