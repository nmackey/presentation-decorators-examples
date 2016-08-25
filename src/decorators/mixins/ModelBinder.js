import { each, chain } from 'underscore';
import Backbone from 'backbone';
import ModelBinder from 'backbone-modelbinder';
import D3Converters from 'D3Converters';

function bindConverters(context) {
  const options = context.bindingOptions || {};
  const excludedBindings = options.exclude;
  const customBindings = options.bindings;
  const modelToBind = options.model || context.model;
  const rootEl = options.el || context.el;

  if (context.modelBinder && modelToBind) {
    const generatedBindings = Backbone.ModelBinder.createDefaultBindings(rootEl, 'name');
    const convertedBindings = {};

    each(context.$('input[data-converter]'), field => {
      const $field = $(field);
      convertedBindings[$field.attr('name')] = {
        selector: `[name="${$field.attr('name')}"]`,
        converter: D3Converters[$field.attr('data-converter')]
      };
    });

    context.modelBinder.bind(modelToBind, rootEl,
      chain({})
        .defaults(customBindings, convertedBindings, generatedBindings)
        .omit(excludedBindings)
        .value()
    );
  }
}

// class method decorator for 'Backbone.View' that create a model binder instance and triggers 'bindConverters' after the method
// generally this will be used on the 'render' method
// e.g. @bindModel
// specify a 'bindingOptions' class property to specify specific binding options
// TODO: make more robust and add error conditions
export default function bindModel(target, key, descriptor) {
  const originalFn = descriptor.value;

  descriptor.value = function value(...args) {
    this.modelBinder = this.modelBinder || new ModelBinder();
    const ret = originalFn.apply(this, args);
    bindConverters(this);
    return ret;
  };
}
