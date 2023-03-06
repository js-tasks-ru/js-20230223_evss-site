/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  const arr = path.split(".");

  let getter = (obj) => {
    let property = obj;

    for (const item of arr) {
      if (property === undefined) break;
      property = property[item];
    }

    return property;
  }

  return getter;
}
