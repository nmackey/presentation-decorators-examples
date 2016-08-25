import { every } from 'underscore';

function filterCollection(predicates = []) {
  this.each(model => {
    model.filtered = !every(predicates, predicate => predicate(model));
  });
  this.trigger('filtered:collection');
}

function _addFiltered() {
  this.$el.addClass('filtered');
}

function _removeFiltered() {
  this.$el.removeClass('filtered');
}

// class method decorator for 'Backbone.Model' that adds a getter and setter for 'filtered' for filtering
// that triggers 'filtered' & 'unfiltered' events
// e.g. @filterable
// TODO: add error conditions
export function filterableModel(target) {
  target.prototype._filtered = false;
  Object.defineProperty(target.prototype, 'filtered', {
    set: function setFiltered(filtered) {
      if (this._filtered !== filtered) {
        this._filtered = filtered;
        this.trigger(filtered ? 'filtered' : 'unfiltered', this);
      }
    },
    get: function getFiltered() {
      return this._filtered;
    }
  });
}

// class method decorator for 'Backbone.Collection' that adds a method (filterCollection)
// that uses a defined 'visibilityPredicates' array and the 'filterableModel' functions
// e.g. @hideableCollection
// TODO: add error conditions
export function filterableCollection(target) {
  Object.assign(target.prototype, {
    filterCollection
  });
}

// class method decorator for 'Backbone.View' that adds methods (_addFiltered and _removeFiltered)
// also wraps the initialize and render functions to add events and filter/unfilter view appropriately
// that uses 'filterableModel' events to add or remove the filtered class from the view
// e.g. @hideableView
// TODO: add error conditions
export function filterableView(target) {
  const originalInit = target.prototype.initialize;
  const initializeWrap = function initializeWrap(...args) {
    originalInit.apply(this, args);
    this.listenTo(this.model, 'filtered', this._addFiltered);
    this.listenTo(this.model, 'unfiltered', this._removeFiltered);
  };

  const originalRender = target.prototype.render;
  const renderWrap = function renderWrap(...args) {
    const originalValue = originalRender.apply(this, args);
    if (this.model.filtered) {
      this._addFiltered();
    }
    return originalValue;
  };

  Object.assign(target.prototype, {
    _addFiltered,
    _removeFiltered,
    initialize: initializeWrap,
    render: renderWrap
  });
}
