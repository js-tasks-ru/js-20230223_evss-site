/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === undefined) {
    return string;
  }
  if (size < 1) {
    return "";
  }

  let result = "";
  let previousItem = "";
  let count = 0;

  for (let i = 0; i < string.length; i++) {
    const currentItem = string[i];
    if (currentItem != previousItem) {
      result += currentItem;
      previousItem = currentItem;
      count = 0;
    } 
    else {
      if (count < size - 1) {
        result += string[i];
        count++
      }
    }
  }
  return result;
}
