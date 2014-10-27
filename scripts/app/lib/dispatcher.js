'use strict';

function Subscription(name) {
  this.name = name;
  this.callbacks = [];
}

Subscription.prototype.registerCallback = function(callback) {
  this.callbacks.push(callback);
}

Subscription.prototype.removeCallback = function(callback) {
  var i = this.callbacks.indexOf(callback);
  if (i >= 0) {
    this.callback.splice(i, 0);
  }
}

Subscription.prototype.clearCallbacks = function(callback) {
  this.callbacks.splice(0,this.callbacks.length);
}

function Publisher() {
  this.events = {};
}

Publisher.prototype.getEvent = function(eventName) {
  if (!this.events[eventName]) {
    var event = new Subscription(eventName);
    this.events[eventName] = event;
  }

  return this.events[eventName];
};

Publisher.prototype.trigger = function() {
  var eventName = arguments[0];
  var args = Array.prototype.slice.call(arguments, 1, arguments.length);
  this.getEvent(eventName).callbacks.forEach(function(callback) {
    callback.apply({}, args);
  });
};

Publisher.prototype.on = function(eventName, callback) {
  this.getEvent(eventName).registerCallback(callback);
};

Publisher.prototype.off = function(eventName, callback) {
  var event = this.getEvent(eventName);

  if (!callback) {
    event.clearCallbacks();
  }

  event.removeCallback(callback);
};

var publisher = new Publisher();

module.exports = publisher;
