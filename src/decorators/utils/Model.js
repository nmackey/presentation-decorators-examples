/**
 * Class decorator for 'Backbone.Model' that assigns a 'defaults'
 * to the prototype to use for the model
 * e.g. @defaults({ title: 'testTitle' })
 *
 * @export
 * @param value - default values to assign to model
 */
export function defaults(value) {
  return function decorator(target) {
    target.prototype.defaults = value;
  };
}
