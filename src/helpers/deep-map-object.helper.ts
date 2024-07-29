const deepMapObject = (data, callback) => {
  const map = (value: any[], key: string | number) => {
    if (value !== undefined && value !== null && typeof value === 'object') {
      callback(value, key);
    }

    if (value === undefined || value === null) {
    } else if (value.constructor === Object) {
      for (const k in value) {
        map(value[k], k);
      }
    } else if (value.constructor === Array) {
      for (let i = 0; i < value.length; i++) {
        map(value[i], i);
      }
    }
  };

  map(data, 0);

  return data;
};
// function deepMapObject(obj, iterator, context) {
//   return _.transform(obj, function(result, val, key) {
//       result[key] = _.isObject(val) && !_.isDate(val) ?
//       deepMapObject(val, iterator, context) :
//                           iterator.call(context, val, key, obj);
//   });
// }

// _.mixin({
//  deepMap: deepMapObject
// });
export default deepMapObject;
