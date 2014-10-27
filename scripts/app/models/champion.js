var _ = require('underscore');
var db = require('app/db');

var cache = {};

var ChampionModel = {
  getLevelNumbers: function() {
    return _.range(1,19);
  },

  toggleChamp: function(show, current) {
    var shown;

    if (_(current).contains(show)) {
      shown = _(current).filter(function(x) {
        return x !== show;
      });
    } else {
      shown = _.flatten([current, show]);
      shown = _.unique(shown);
    }

    return shown;
  },

  getMaxGlobalDps: function() {
    if (!cache.maxDps) {
      cache.maxDps = _(ChampionModel.getAllDpsLevels()).map(function(thisLevel) {
        return _(thisLevel).max();
      });
    }

    return cache.maxDps;
  },

  getMinGlobalDps: function(list) {
    if (!cache.minDps) {
      cache.minDps = _(ChampionModel.getAllDpsLevels()).map(function(thisLevel) {
        return _(thisLevel).min();
      });
    }

    return cache.minDps;
  },

  getAllDpsLevels: function() {
    return _.zip.apply(_, ChampionModel.getAllDps());
  },

  getAllDps: function() {
    return _(db.champions).map(function(champ) {
      return ChampionModel.getDpsScaling(champ);
    });
  },

  getDpsScaling: function(champ) {
    var adScale = ChampionModel.getDamageScaling(champ);
    var asScale = ChampionModel.getAttackSpeedScaling(champ);

    var dpsScale = _(_.zip(adScale, asScale)).map(function(x) {
      return Number(Number(x[0] * x[1]).toFixed(2));
    });

    return dpsScale;
  },

  getAttackSpeedScaling: function(champ) {
    var stats = champ.stats;
    var levels = ChampionModel.getLevelNumbers();

    var base = 0.625 / (1 + stats.attackspeedoffset);
    var perLevel = stats.attackspeedperlevel;

    var series = _(levels).map(function(level) {
      var value, scale, percent;

      percent = (level * perLevel) / 100;
      scale = 1 + percent;
      value = Number(base * scale).toFixed(3);

      return Number(value);
    });

    return series;
  },

  getDamageScaling: function(champ) {
    var stats = champ.stats;
    var levels = ChampionModel.getLevelNumbers();

    var base = stats.attackdamage;
    var perLevel = stats.attackdamageperlevel;

    var series = _(levels).map(function(level) {
      var value;

      value = (base + level * perLevel).toFixed(2);

      return Number(value);
    });

    return series;
  }
};

module.exports = ChampionModel;
