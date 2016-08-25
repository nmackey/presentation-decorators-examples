import Backbone from 'backbone';
import { isEqual } from 'underscore';

function save(attributes = {}, options = {}) {
  const success = options.success;

  options.success = resp => {
    if (success) {
      success(this, resp);
    }
    this.saveState();
  };

  return Backbone.Model.prototype.save.call(this, attributes, options);
}

function saveState() {
  this._revertAttributes = $.extend(true, {}, this.attributes);
}

function restoreState() {
  if (this._revertAttributes) {
    this.clear({ silent: true });
    this.set(this._revertAttributes, { silent: true });
  }
}

function hasStateChanged() {
  if (this._revertAttributes) {
    return !isEqual(this._revertAttributes, this.attributes);
  }
  return false;
}

// class method decorator for 'Backbone.Model' that adds methods for maintaining state, overrides the save method
// e.g. @maintainState
// TODO: add error conditions
export default function maintainState(target) {
  Object.assign(target.prototype, {
    save,
    saveState,
    restoreState,
    hasStateChanged
  });
}
