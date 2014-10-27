module.exports = {
  find: function(list, id) {
    var len = list.length;

    for (var i = 0; i < len; i++) {
      if (list[i].id === id) {
        return list[i];
      }
    }
  }
};
