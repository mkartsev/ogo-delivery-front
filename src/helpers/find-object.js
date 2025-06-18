export function findObjectByKey(obj, key, value) {
  if (obj[key] === value) {
    return obj;
  }

  for (var prop in obj) {
    if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'object') {
      var result = findObjectByKey(obj[prop], key, value);
      if (result) {
        return result;
      }
    }
  }

  return null;
}