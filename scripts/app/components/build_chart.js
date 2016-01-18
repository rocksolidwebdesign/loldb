/** @jsx React.DOM */
'use strict';

var _ = require('underscore');
var Chart = require('vendor/Chart.min');
var ChampionModel = require('app/models/champion');
var React = require('react');
var dispatcher = require('app/lib/dispatcher');
var ColorConfig = require('app/lib/color_config');
var ChartData = require('app/lib/chart_data');
var db = require('app/db');
var state = require('app/state');

var BuildChart = React.createClass({
  render: function() {
    var styles = {
      display: 'none'
    };

    return (
      <div className="champChart" id="champChartContainer">
        <div id="chartBlurb" className="chartBlurb">Click a champion to add them to the chart.</div>
        <div id="chartLabel" className="chartLabel">{this.state.chartTitle}</div>
        <canvas id="chartjsCanvas" width="800" height="400" style={styles}></canvas>
      </div>
    );
  },

  getInitialState: function() {
    return {
      chartTitle: 'Damage Per Second',
      builds: []
    };
  },

  componentDidMount: function() {
    dispatcher.on('builds:change', this.updateState);
  },

  updateState: function(builds) {
    this.setState({
      builds: builds
    });
  },

  componentDidUpdate: function() {
    var data = ChartData.getChartData(this.state.builds);
    this.drawChart(data);
    this.showChart();
  },

  drawChart: function(data, options) {
    options = options || {
      bezierCurve: false,
      pointDot: false
    };

    this.getChart().Line(data, options);
  },

  getChart: function() {
    if (!this.linesChart) {
      ctx = document.getElementById("chartjsCanvas").getContext("2d");
      this.linesChart = new Chart(ctx);
    }

    return this.linesChart;
  },

  showChart: function() {
    document.getElementById('chartjsCanvas').style.display = 'inline-block';
    document.getElementById('chartBlurb').style.display = 'none';
  }
});

module.exports = BuildChart;
