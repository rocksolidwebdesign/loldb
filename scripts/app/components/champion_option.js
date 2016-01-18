/** @jsx React.DOM */
'use strict';

var dispatcher = require('app/lib/dispatcher');
var React = require('react');
var state = require('app/state');

var ChampionOption = React.createClass({
  handleClick: function() {
    state.assignChampion(this.props.buildId, this.props.champion.id);
    dispatcher.trigger('modal:close');
  },

  render: function() {
    var data = this.props.champion;
    var imgUrl = '//ddragon.leagueoflegends.com/cdn/'+data.version+'/img/champion/'+data.image.full;

    return (
      <div className="championOption" onClick={this.handleClick}>
        <img src={imgUrl} alt={data.name} title={data.blurb} />
      </div>
    );
  }
});

module.exports = ChampionOption;
