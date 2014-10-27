/** @jsx React.DOM */
'use strict';

var React = require('react');

var BuildList = require('app/components/build_list');
var BuildChart = require('app/components/build_chart');

var App = React.createClass({
  render: function() {
    return (
      <div className="loldbApp">
        <form action="/" method="post">
          <h1 className="mainHeadline">League of Legends Simulator</h1>
          <BuildList />
          <BuildChart />
        </form>
      </div>
    );
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    el.getElementsByTagName('form')[0].onsubmit = function(e) { e.preventDefault(); return false; };
    this.appendModalContainer();
  },

  appendModalContainer: function() {
    var target = document.getElementById('modalTarget');

    if (!target) {
      var body = document.getElementsByTagName('body')[0];
      var div = document.createElement('div');
      div.id = 'modalTarget';
      body.appendChild(div);
    }
  }
});

module.exports = App;
