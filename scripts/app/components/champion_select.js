/** @jsx React.DOM */
'use strict';

var React = require('react');
var db = require('app/db');
var ChampionOption = require('app/components/champion_option');

var ChampionSelect = React.createClass({
  render: function() {
    var buildId = this.props.buildId;
    var nodes = db.champions.map(function(champion) {
      var key = 'champion_select_option_' + champion.id;
      return (
        <ChampionOption key={key} champion={champion} buildId={buildId} />
      );
    });

    return (
      <div className="championChooser">
        {nodes}
      </div>
    );
  }
});

module.exports = ChampionSelect;
