import { each, reduce, isUndefined } from 'underscore';
import moment from 'moment';

const UI_FORMAT = 'MM/DD/YYYY';
const API_FORMAT = 'YYYY-MM-DD';

function convertDates(attributes, dateFields, fromFormat, toFormat) {
  each(dateFields, dateField => {
    // handle nested properties with 'dot' notation
    const splits = dateField.split('.');
    const lastIndex = splits.length - 1;
    const obj = reduce(splits.slice(0, lastIndex), (memo, fragment) =>
      (isUndefined(memo) ? memo : memo[fragment])
    , attributes);

    // if the object and the property are defined then format the property and assign it
    if (!isUndefined(obj) && !isUndefined(obj[splits[lastIndex]])) {
      obj[splits[lastIndex]] = moment(obj[splits[lastIndex]], fromFormat).format(toFormat);
    }
  });
  return attributes;
}

// class method decorator for backbone model 'toJSON' that maps date fields from UI format to ISO format
// e.g. @convertUiDatesToIso([ 'date' ])
// value: array of strings (supports dot notation for nested objects)
export function convertUiDatesToIso(dateFields) {
  return function decorator(target, name, descriptor) {
    const originalFn = descriptor.value;
    descriptor.value = function wrap(...args) {
      const ret = originalFn.apply(this, args);
      return convertDates(ret, dateFields, UI_FORMAT, API_FORMAT);
    };
    return descriptor;
  };
}

// class method decorator for backbone model 'parse' that maps date fields from ISO format to UI format
// e.g. @convertIsoDatesToUi([ 'date' ])
// value: array of strings (supports dot notation for nested objects)
export function convertIsoDatesToUi(dateFields) {
  return function decorator(target, name, descriptor) {
    const originalFn = descriptor.value;
    descriptor.value = function wrap(...args) {
      const convertedAttrs = convertDates(args[0], dateFields, API_FORMAT, UI_FORMAT);
      return originalFn.call(this, convertedAttrs, ...args.slice(1));
    };
    return descriptor;
  };
}
