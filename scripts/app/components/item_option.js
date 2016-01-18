/** @jsx React.DOM */
'use strict';

var dispatcher = require('app/lib/dispatcher');
var React = require('react');
var state = require('app/state');

var ItemOption = React.createClass({
  handleClick: function() {
    state.assignItemSlot(this.props.slotId, this.props.item.id);
    dispatcher.trigger('modal:close');
  },

  render: function() {
    var data = this.props.item;
    var imgUrl = '//ddragon.leagueoflegends.com/cdn/4.18.1/img/item/'+data.image.full;

    return (
      <div className="itemOption" onClick={this.handleClick}>
        <img src={imgUrl} alt={data.name} title={data.blurb} />
      </div>
    );
  }
});

module.exports = ItemOption;
