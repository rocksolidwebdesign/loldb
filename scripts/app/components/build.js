/** @jsx React.DOM */
'use strict';

var React = require('react');
var BuildSlot = require('app/components/build_slot');
var ChampionSelect = require('app/components/champion_select');
var Modal = require('app/components/modal');
var state = require('app/state');
var db = require('app/db');

var Build = React.createClass({
  render: function() {
    var data = this.props.build;

    var image = '';
    var buildLabel = 'Champion';

    if (data.championId) {
      var imgUrl = '//ddragon.leagueoflegends.com/cdn/4.18.1/img/champion/'+this.props.build.championId+'.png';
      var imgKey = 'build_image_'+data.id;

      image = (
        <img key={imgKey} src={imgUrl} alt="" />
      );

      var champion = db.find(db.champions, data.championId);

      if (champion) {
        buildLabel = champion.name;
      }
    }

    var levels = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];

    var nodes = data.slots.map(function(slot) {
      var key = 'build_'+data.id+'_item_'+slot.id;

      return (
        <BuildSlot key={key} slot={slot} />
      );
    });

    var apLvlCallback = this.handleAbilityLevelUp;

    return (
      <div className="buildConfig">
        <table className="buildConfigTable">
          <thead>
            <tr>
              <th className="buildLabelChampion">
              </th>
              <th className="buildLabelItems">
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
              </td>
            </tr>
            <tr>
              <td className="buildAvatarContainer">
                <div>
                  {buildLabel}
                </div>
                <div className="buildAvatar" onClick={this.handleChooseChampion}>
                  {image}
                </div>
              </td>
              <td>
                <h2>
                  Ability Leveling Sequence
                </h2>
                <div>
                  <table className="abilityLevelingSequence">
                    <tr>
                      <th></th>
                      {levels.map(function(level) {
                        return (
                          <th>{level}</th>
                        );
                      })}
                    </tr>
                    <tr>
                      <th>Q</th>
                      {levels.map(function(level) {
                        var name = 'ability_level['+level+']';
                        return (
                          <td><input type="radio" name={name} value="q" data-level={level} className="apLvlInput" onChange={apLvlCallback} /></td>
                        );
                      })}
                    </tr>
                    <tr>
                      <th>W</th>
                      {levels.map(function(level) {
                        var name = 'ability_level['+level+']';
                        return (
                          <td><input type="radio" name={name} value="w" data-level={level} className="apLvlInput" onChange={apLvlCallback} /></td>
                        );
                      })}
                    </tr>
                    <tr>
                      <th>E</th>
                      {levels.map(function(level) {
                        var name = 'ability_level['+level+']';
                        return (
                          <td><input type="radio" name={name} value="e" data-level={level} className="apLvlInput" onChange={apLvlCallback} /></td>
                        );
                      })}
                    </tr>
                    <tr>
                      <th>R</th>
                      {levels.map(function(level) {
                        var name = 'ability_level['+level+']';
                        return (
                          <td><input type="radio" name={name} value="r" data-level={level} className="apLvlInput" onChange={apLvlCallback} /></td>
                        );
                      })}
                    </tr>
                  </table>
                </div>
                <h2>
                  Item Build Sequence
                </h2>
                <div>
                  <button className="addItemButton"
                    onClick={this.handleAddItem}>
                    + Add Item
                  </button><br/>
                  {nodes}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  },

  getAbilityLevelRadios: function() {
    var memo = [];
    var levels = [];
    var inputs = document.getElementsByClassName('apLvlInput');
    var len = inputs.length;
    var i = 0;

    for (i = 0; i < len; i++) {
      memo[i] = inputs[i];
    }

    return memo;
  },

  getLevelsArray: function() {
    var a = [];

    for (var i = 0; i < 18; i++) {
      a[i] = 0;
    }

    return a;
  },

  getAbilityLevelsBaseArray: function() {
    return this.getLevelsArray().map(function() {
      return { 'q': 0, 'w': 0, 'e': 0, 'r': 0 };
    });
  },

  getAbilityLevelSelections: function(radios) {
    var radios = this.getAbilityLevelRadios();

    var levels = this.getLevelsArray().map(function(x) {
      return null;
    });

    var selections = radios.reduce(function(memo, radio) {
      var level = Number(radio.getAttribute('data-level'));

      if (radio.checked) {
        memo[level-1] = radio.value;
      }

      return memo;
    }, levels);

    return selections;
  },

  getAbilityLevelSequence: function(baseLevels, selections) {
    var abilityData = selections.reduce(function(memo, choice) {
      var level = memo.x;

      if (choice) {
        memo[choice] += 1;
      }

      memo.sequence[level].q = memo.q;
      memo.sequence[level].w = memo.w;
      memo.sequence[level].e = memo.e;
      memo.sequence[level].r = memo.r;

      memo.x += 1;

      return memo;
    }, {
      'sequence': baseLevels,
      'x': 0,
      'q': 0,
      'w': 0,
      'e': 0,
      'r': 0
    });

    return abilityData.sequence;
  },

  handleAbilityLevelUp: function(e) {
    var baseLevels = this.getAbilityLevelsBaseArray();
    var selections = this.getAbilityLevelSelections();
    var sequence = this.getAbilityLevelSequence(baseLevels, selections);

    state.updateAbilitySequence(this.props.build.id, selections, sequence);
  },

  handleChooseChampion: function() {
    var key = 'champion_select_widget';
    var content = (
      <ChampionSelect key={key} buildId={this.props.build.id} />
    );

    var modalKey = 'modal';
    React.renderComponent(
      <Modal key={modalKey} content={content} />,
      document.getElementById('modalTarget')
    );
  },

  handleAddItem: function() {
    state.addItemSlot(this.props.build.id);
  }
});

module.exports = Build;
