/** @jsx React.DOM */
'use strict';

require('./styles/global.scss');
require('./styles/modal.scss');
require('./styles/lists.scss');
require('./styles/chart.scss');
require('./styles/builds.scss');

var _ = require('underscore');
var React = require('react');
var ChampionService = require('app/services/champions');
var AbilityService = require('app/services/abilities');
var ItemService = require('app/services/items');
var App = require('app/components/app');
var db = require('app/db');
var state = require('app/state');

window.db = db;
window.state = state;

var render = function(champions, items, abilities) {
  React.renderComponent(<App champions={champions} items={items} />, document.body);
};

var run = function() {
  ChampionService.fetch().then(function(champions) {
    ItemService.fetch().then(function(items) {
      AbilityService.fetch().then(function(abilities) {
        _(champions).each(function(champion) {
          var abil = _(abilities).find(function(x) {
            return x.id === champion.id;
          });

          if (abil) {
            _(champion).extend(abil);
          }
        });

        db.champions = champions;
        db.items = items;

        React.renderComponent(<App />, document.body);
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", function(event) {
  run();
});
