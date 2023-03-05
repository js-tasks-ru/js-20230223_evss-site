/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split('.');

  let getter = (data) => {
    let property = arr.shift();

    if (!arr.length) {
      return data[property];
    } 
    else {
      const { [property]: subObject } = data;
      return subObject === undefined ? subObject : getter(subObject);
    }
  };

  return getter;
}
