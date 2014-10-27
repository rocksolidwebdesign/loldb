/** @jsx React.DOM */
'use strict';

var dispatcher = require('app/lib/dispatcher');
var React = require('react');
var Build = require('app/components/build');
var state = require('app/state');

var BuildList = React.createClass({
  render: function() {
    var nodes = this.state.builds.map(function(build) {
      return (
        <Build key={build.id} build={build} />
      );
    });

    return (
      <div className="buildList">
        <div className="buildListActions">
          <button className="addBuild"
            onClick={this.handleAddBuild}>
            + Add Build
          </button>
          &nbsp;
          <button className="addBuild"
            onClick={this.handleAddBuild}>
            Reset
          </button>
        </div>
        {nodes}
      </div>
    );
  },

  getInitialState: function() {
    return {builds: state.builds};
  },

  componentDidMount: function() {
    dispatcher.on('builds:change', this.updateState);
  },

  updateState: function(builds) {
    this.setState({
      builds: builds
    });
  },

  handleAddBuild: function() {
    state.addBuild();
  }
});

module.exports = BuildList;
