import Backbone from 'backbone';

function fetch(...args) {
  this.deferredFetch = this.deferredFetch || Backbone.Model.prototype.fetch.call(this, ...args);
  return this.deferredFetch;
}

// class method decorator for 'Backbone.Model' that overrides the fetch method
// e.g. @deferredFetch
// TODO: add error conditions
export default function deferredFetch(target) {
  Object.assign(target.prototype, { fetch });
}
