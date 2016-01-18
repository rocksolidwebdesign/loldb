var dispatcher = require('app/lib/dispatcher');
var db = require('app/db');

var StateManager = function() {
  this.builds = [];
  this.itemSlots = [];

  this.buildSequence = 0;
  this.itemSequence = 0;
};

StateManager.prototype = {
  assignChampion: function(buildId, championId) {
    var build = db.find(this.builds, buildId);

    if (!build) {
      return;
    }

    build.championId = championId;

    dispatcher.trigger('builds:change', this.builds);
  },

  assignItemSlot: function(slotId, itemId) {
    var slot = db.find(this.itemSlots, slotId);

    if (!slot) {
      return;
    }

    var item = db.find(db.items, itemId);

    if (!item) {
      return;
    }

    slot.itemId = item.id;

    dispatcher.trigger('builds:change', this.builds);
  },

  updateSlot: function(slotId, vars) {
    var slot = db.find(this.itemSlots, slotId);

    if (!slot) {
      return;
    }

    slot.level = Number(vars.level);

    dispatcher.trigger('builds:change', this.builds);
  },

  updateAbilitySequence: function(buildId, selections, sequence) {
    var build = db.find(this.builds, buildId);

    if (build) {
      build.selections = selections;
      build.sequence = sequence;

      dispatcher.trigger('builds:change', this.builds);
    }
  },

  addBuild: function() {
    var build = this.createBuild();

    this.builds.push(build);

    dispatcher.trigger('builds:change', this.builds);
  },

  addItemSlot: function(buildId) {
    var build = db.find(this.builds, buildId);

    if (!build) {
      return;
    }

    var item = this.createItemSlot();

    this.itemSlots.push(item);
    build.slots.push(item);

    dispatcher.trigger('builds:change', this.builds);
  },

  createBuild: function() {
    var id = this.buildSequence++;
    var item = this.createItemSlot(id);

    this.itemSlots.push(item);

    return {
      id: id,
      slots: [item]
    };
  },

  createItemSlot: function(buildId) {
    return {
      id: this.itemSequence++,
      level: 1,
      buildId: buildId
    };
  }
};

module.exports = new StateManager();
