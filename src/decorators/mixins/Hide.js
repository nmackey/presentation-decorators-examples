import { Collection } from 'backbone';

function filterVisibility() {
  this.each(model => {
    model.visible = this.visibilityPredicate(model);
  });
}

function _addHidden() {
  this.$el.addClass('hidden');
}

function _removeHidden() {
  this.$el.removeClass('hidden');
}

// class method decorator for 'Backbone.Model' that adds a getter and setter for visible
// that triggers 'hidden' and 'shown' events
// e.g. @hideable
// TODO: add error conditions
export function hideableModel(target) {
  target.prototype._visible = true;
  Object.defineProperty(target.prototype, 'visible', {
    set: function setVisibility(visible) {
      if (this._visible !== visible) {
        this._visible = visible;
        this.trigger(visible ? 'shown' : 'hidden', this);
      }
    },
    get: function getVisibility() {
      return this._visible;
    }
  });
}

// class method decorator for 'Backbone.Collection' that adds a method 'filterVisibility'
// that uses a defined 'visibilityPredicates' array and the 'hideableModel' functions
// e.g. @hideableCollection
// TODO: add error conditions
export function hideableCollection(target) {
  const originalInit = target.prototype.initialize;
  const initializeWrap = function initializeWrap(...args) {
    originalInit.apply(this, args);
    this.listenTo(this, 'sync', (type) => {
      // only pay attention to collection sync events
      if (type instanceof Collection) {
        this.filterVisibility();
      }
    });
  };
  Object.assign(target.prototype, {
    filterVisibility,
    initialize: initializeWrap
  });
}

// class method decorator for 'Backbone.View' that adds methods '_addHidden' and '_removeHidden'
// also wraps the initialize and render functions to add events and hide/show view appropriately
// that uses 'hideableModel' events to add or remove the hidden class from the view
// e.g. @hideableView
// TODO: add error conditions
export function hideableView(target) {
  const originalInit = target.prototype.initialize;
  const initializeWrap = function initializeWrap(...args) {
    originalInit.apply(this, args);
    this.listenTo(this.model, 'hidden', this._addHidden);
    this.listenTo(this.model, 'shown', this._removeHidden);
  };

  const originalRender = target.prototype.render;
  const renderWrap = function renderWrap(...args) {
    const originalValue = originalRender.apply(this, args);
    if (!this.model.visible) {
      this._addHidden();
    }
    return originalValue;
  };

  Object.assign(target.prototype, {
    _addHidden,
    _removeHidden,
    initialize: initializeWrap,
    render: renderWrap
  });
}
