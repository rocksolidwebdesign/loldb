/** @jsx React.DOM */
'use strict';

var _ = require('underscore');
var ChampionModel = require('app/models/champion');
var ColorConfig = require('app/lib/color_config');
var db = require('app/db');

var ChartData = {
  getItemScaling: function(build, scaling) {
    var levelConfigs = [];
    var prevConfig;
    var slots = build.slots;

    return scaling.map(function(value, index) {
      var level = index + 1;
      var levelSlots = slots.filter(function(slot) {
        return slot.itemId && slot.level === level;
      });

      if (levelSlots.length <= 0 && index !== 0) {
        levelSlots = levelConfigs[level-1];
      }

      levelConfigs[level] = levelSlots;

      var levelItems = levelSlots.map(function(slot) {
        return db.find(db.items, slot.itemId);
      });

      var flatDamageMod = levelItems.filter(function(item) {
        return item.stats.FlatPhysicalDamageMod;
      }).map(function(item) {
        return item.stats.FlatPhysicalDamageMod;
      }).reduce(function(memo, x) {
        return memo + x;
      }, 0);

      return value + flatDamageMod;
    });
  },

  getBuildDpsLine: function(build) {
    var champ = db.find(db.champions, build.championId);

    var scaling = ChampionModel.getDpsScaling(champ);
    var data = ChartData.getItemScaling(build, scaling);
    var config = {
      label: champ.name,
      data: data
    };

    var colorConfig = ColorConfig.getColorConfig('dpsLine');

    return _(config).extend(colorConfig);
  },

  getDpsLines: function(builds) {
    return builds.filter(function(build) {
      return build.championId;
    }).map(ChartData.getBuildDpsLine);
  },

  getMinDpsConfig: function() {
    return _(ColorConfig.getColorConfig('minDps')).extend({
      label: 'Min DPS',
      data: ChampionModel.getMinGlobalDps()
    });
  },

  getMaxDpsConfig: function() {
    return _(ColorConfig.getColorConfig('maxDps')).extend({
      label: 'Max DPS',
      data: ChampionModel.getMaxGlobalDps()
    });
  },

  getOtherLines: function() {
    return [
      ChartData.getMaxDpsConfig(),
      ChartData.getMinDpsConfig()
    ];
  },

  getChartData: function(builds) {
    return {
      labels: ChartData.getHorizAxis(),
      datasets: ChartData.getChartDatasets(builds)
    };
  },

  getHorizAxis: function() {
    var levels = _.range(1,19);

    return _(levels).map(function(x) {
      return 'level '+x;
    });
  },

  getChartDatasets: function(builds) {
    var chartData, lines;

    var otherLines = ChartData.getOtherLines();
    var champLines = ChartData.getDpsLines(builds);

    lines = [
      otherLines, champLines
    ];

    return _(lines).flatten();
  }
};

module.exports = ChartData;
