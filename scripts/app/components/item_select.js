/** @jsx React.DOM */
'use strict';

var React = require('react');
var db = require('app/db');
var ItemOption = require('app/components/item_option');

var ItemSelect = React.createClass({
  render: function() {
    var slotId = this.props.slotId;
    var nodes = db.items.map(function(item) {
      var key = 'item_select_option_' + item.id;
      return (
        <ItemOption key={key} item={item} slotId={slotId} />
      );
    });

    return (
      <div className="itemChooser">
        {nodes}
      </div>
    );
  }
});

module.exports = ItemSelect;
