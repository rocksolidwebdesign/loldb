/** @jsx React.DOM */
'use strict';

var ColorConfig = {
  palletteColors: [
    {
      fillColor: "rgba(150,150,150,0)",
      strokeColor: "rgba(150,150,150,1)",
      pointColor: "rgba(150,150,150,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(150,150,150,1)"
    }
  ],

  namedConfigs: {
    dpsLine: {
      fillColor: "rgba(150,150,150,0)",
      strokeColor: "rgba(150,150,150,1)",
      pointColor: "rgba(150,150,150,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(150,150,150,1)"
    },
    maxDps: {
      fillColor: "rgba(220,220,220,0.2)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)"
    },
    minDps: {
      fillColor: "rgba(255,255,255,0.9)",
      strokeColor: "rgba(220,220,220,1)",
      pointColor: "rgba(220,220,220,1)",
      pointStrokeColor: "#fff",
      pointHighlightFill: "#fff",
      pointHighlightStroke: "rgba(220,220,220,1)"
    }
  },

  getColorConfig: function(name) {
    if (name) {
      return ColorConfig.getNamedColorConfig(name);
    }

    return ColorConfig.getRandomColorConfig();
  },

  getNamedColorConfig: function(name) {
    return ColorConfig.namedConfigs[name];
  },

  getRandomColorConfig: function() {
    var min = 0;
    var max = palletteColors.length;

    var rand = Math.floor(Math.random() * (max - min)) + min;

    return palletteColors[rand];
  }
};

module.exports = ColorConfig;
