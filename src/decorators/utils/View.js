import { isFunction } from 'underscore';

// class decorator for 'Backbone.View' that assigns a 'className' to the prototype to use for the view
// e.g. @className('entity')
// value: string - takes a class name to assign to a view
// TODO: add tests and error conditions
export function className(value) {
  return function decorator(target) {
    target.prototype.className = value;
  };
}

// class decorator for 'Backbone.View' that assigns a 'tagName' to the prototype to use for the view
// e.g. @tagName('li')
// value: string - takes an element name to assign to a view
// TODO: add tests and error conditions
export function tagName(value) {
  return function decorator(target) {
    target.prototype.tagName = value;
  };
}

// class decorator for 'Backbone.View' that assigns the view to an element
// this is the element that the view will be rendered on
// e.g. @el('#id')
// value: string - takes a selector to assign the view to
// TODO: add tests and error conditions
export function el(value) {
  return function decorator(target) {
    target.prototype.el = value;
  };
}

// class method decorator for methods that should be triggered on an event
// e.g. @on('click .btn')
// value: string ('event selector') - event selector string to trigger method on
// TODO: add tests
export function on(eventName) {
  return function decorator(target, name) {
    if (!target.events) {
      target.events = {};
    }
    if (isFunction(target.events)) {
      throw new Error('The on decorator is not compatible with an events method');
    }
    if (!eventName) {
      throw new Error('The on decorator requires an eventName argument');
    }
    target.events[eventName] = name;
  };
}
