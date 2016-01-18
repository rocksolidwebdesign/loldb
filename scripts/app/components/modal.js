/** @jsx React.DOM */
'use strict';

var React = require('react');
var dispatcher = require('app/lib/dispatcher');

var Modal = React.createClass({
  componentWillMount: function() {
    var modalTarget = document.getElementById('modalTarget');
    modalTarget.style.display = 'block';
  },

  componentDidMount: function() {
    var el = this.getDOMNode();

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        x = w.innerWidth || e.clientWidth || g.clientWidth,
        y = w.innerHeight|| e.clientHeight|| g.clientHeight;

    el.style.top = '100px';
    //el.style.marginTop = '-' + Math.floor(el.offsetHeight / 2) + 'px';

    dispatcher.on('modal:close', this.handleClose);
  },

  handleClose: function() {
    var modalTarget = document.getElementById('modalTarget');
    React.unmountComponentAtNode(modalTarget);
    modalTarget.style.display = 'none';
  },

  render: function() {
    return (
      <div className="modal">
        <div className="modalToolbar" id="modalContent">
          <button onClick={this.handleClose}>X</button>
        </div>
        <div className="modalContent" id="modalContent">
          {this.props.content}
        </div>
      </div>
    );
  }
});

module.exports = Modal;
