const strReg = "[a-zA-Z-_0-9]+";
let quote = "(\"|')?";
let selectorReg = {
  tagName: `(?<name>${strReg})`,
  id: `\\#(?<name>${strReg})`,
  class: `\\.(?<name>${strReg})`,
  attribute: `\\[(?<name>${strReg})(=${quote}(?<value>.*?)${quote})?\\]`,
};

function filter(type, obj) {
  if (type === "tagName") {
    for (let key of Object.keys(obj)) {
      let value = obj[key]
      obj[key] = value.toUpperCase();
    }
  }
  return obj;
}

function parseSelector(str) {
  let list = [],
    lastLen = 0;
  while (str.length !== lastLen) {
    lastLen = str.length;
    for (let regName of Object.keys(selectorReg)) {
      let regValue = selectorReg[regName]
      let match = str.match(regValue);
      if (match && match.index === 0) {
        list.push({ ...filter(regName, { ...match.groups }), type: regName });
        str = str.substring(match[0].length);
      }
    }
  }
  return str.length ? false : list;
}
export default parseSelector;
