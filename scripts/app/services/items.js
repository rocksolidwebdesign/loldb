var _ = require('underscore');
var $ = require('jquery');
var Q = require('q');
var settings = require('../settings');

module.exports = {
  fetch: function() {
    var deferred = Q.defer();
    var url = settings.apiUrl+'/api/items';

    $.ajax(url, {
      success: function(jsonResponse, textStatus, jqXHR) {
        var items, list, keys;

        keys = Object.keys(jsonResponse.data);
        list = jsonResponse.data;

        items = _(keys).map(function(key) {
          return _({id: key}).extend(list[key]);
        });

        deferred.resolve(items);
      },
      error: function(jqXHR, textStatus, errorMsg) {
        deferred.reject(jqXHR);
      }
    });

    return deferred.promise;
  }
};
