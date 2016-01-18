/** @jsx React.DOM */
'use strict';

var React = require('react');
var Modal = require('app/components/modal');
var ItemSelect = require('app/components/item_select');
var state = require('app/state');
var db = require('app/db');

var BuildSlot = React.createClass({
  render: function() {
    var image = '';

    var data = this.props.slot;

    if (data.itemId) {
      var item = db.find(db.items, data.itemId);

      var imgUrl = '//ddragon.leagueoflegends.com/cdn/4.18.1/img/item/'+item.image.full;
      var imgKey = 'build_item_image_'+data.id;

      image = (
        <img key={imgKey} src={imgUrl} alt="" />
      );
    }

    return (
      <div className="buildItem">
        <input type="text" className="buildItemLevelInput" onInput={this.handleUpdateSlot} />
        <div className="buildItemAvatar" onClick={this.handleChooseItem}>
          {image}
        </div>
      </div>
    );
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    var input = el.getElementsByTagName('input')[0];
    var level = this.props.level || 1;
    input.setAttribute('value', level);
  },

  handleChooseItem: function() {
    var key = 'item_select_widget';
    var content = (
      <ItemSelect key={key} slotId={this.props.slot.id} />
    );

    var modalKey = 'modal';
    React.renderComponent(
      <Modal key={modalKey} content={content} />,
      document.getElementById('modalTarget')
    );
  },

  handleUpdateSlot: function(e) {
    var el = this.getDOMNode();
    var input = el.getElementsByTagName('input')[0];
    state.updateSlot(this.props.slot.id, {level: input.value});
  }
});

module.exports = BuildSlot;
