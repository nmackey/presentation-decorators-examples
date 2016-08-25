import Backbone from 'backbone';

// class method decorator for 'Backbone.View' that binds a model to view for validation purposes
// generally this will be used on the 'render' method
// e.g. @validate
// TODO: add error conditions
export default function validate(target, key, descriptor) {
  const originalFn = descriptor.value;

  descriptor.value = function value(...args) {
    const ret = originalFn.apply(this, args);
    Backbone.Validation.bind(this, { forceUpdate: true });
    return ret;
  };
}
