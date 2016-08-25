/**
 * Class decorator for 'Backbone.Collection' that assigns a 'comparator'
 * to the prototype to use for the collection
 * e.g. @defaults({ title: 'testTitle' })
 *
 * @export
 * @param value - comparator name/object to assign to collection
 */
export function comparator(value) {
  return function decorator(target) {
    target.prototype.comparator = value;
  };
}
