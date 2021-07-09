function pushOrCreate(array, item) {
  if (array) {
    array.push(item);
    return array;
  } else return [item];
}

function defineOrCreate(obj, key, value) {
  if (obj) {
    obj[key] = value;
    return obj;
  } else return { [key]: value };
}

module.exports = function define(columns) {
  let table = {};
  let data = {};
  let colLen = columns.length;
  for (let [index, col] of columns.entries()) table[col] = { order: index };

  function check({ datat, key, isLoopContinue, saveData, by = "follow" }) {
    if (datat[key]) {
      if (!isLoopContinue)
        // else
        datat[key].callback = pushOrCreate(datat[key].callback, saveData);
      // datat[key][by] = defineOrCreate(datat[key][by], "callback", {});
    } else {
      // create follow if it's not end of loop otherwise do save as callback
      if (isLoopContinue)
        datat[key] = {
          [by]: {},
        };
      else
        datat[key] = {
          callback: [saveData],
        };
    }
    if (isLoopContinue) datat = datat[key][by];
    return datat;
  }

  function save(param, saveData) {
    let datat = data;
    for (let i = 0; i < colLen; i++) {
      let isLoopContinue = i + 1 < colLen;
      let col = columns[i];
      let key;
      if (param[col]) key = param[col];
      else key = "";
      if (Array.isArray(key)) {
        key = key.sort((i1, i2) => (i1 > i2 ? 1 : 0));
        let keyLen = key.length;
        for (let j = 0; j < keyLen - 1; j++) {
          let isKeyLoopContinue = j + 1 < keyLen;
          datat = check({
            datat,
            key: key[j],
            isLoopContinue: isLoopContinue || isKeyLoopContinue,
            saveData,
            by: "goDeep",
          });
        }
        let last = key[keyLen - 1];
        datat = check({ datat, key: last, isLoopContinue, saveData });
      } else {
        datat = check({ datat, key, isLoopContinue, saveData });
      }
      // if(key is array) iterate by go deep
    }
  }

  function spotCheck({ datat, paramValue, isLoopContinue, by = "follow" }) {
    if (isLoopContinue) {
      if (datat[paramValue] && datat[paramValue][by]) {
        datat = datat[paramValue][by];
      } else {
        return undefined;
      }
    } else {
      if (datat[paramValue] && datat[paramValue].callback) {
        return datat[paramValue].callback;
      } else {
        return undefined;
      }
    }
    return datat;
  }

  function spot(param) {
    let datat = data;
    for (let i = 0; i < colLen; i++) {
      let isLoopContinue = i + 1 < colLen;
      let col = columns[i];
      let paramValue = param[col] || "";
      if (Array.isArray(paramValue)) {
        paramValue = paramValue.sort();
        let paramValueLen = paramValue.length;
        for (let j = 0; j < paramValueLen - 1; j++) {
          let isKeyLoopContinue = j + 1 < paramValueLen;
          datat = spotCheck({
            datat,
            paramValue: paramValue[j],
            isLoopContinue: isLoopContinue || isKeyLoopContinue,

            by: "goDeep",
          });
        }
        if (!datat) return undefined;
        let last = paramValue[paramValueLen - 1];
        datat = spotCheck({ datat, paramValue: last, isLoopContinue });
        if (!datat) return undefined;
      } else {
        datat = spotCheck({ datat, paramValue, isLoopContinue });
        if (!datat) return undefined;
      }
    }
    return datat;
  }

  return { save, spot, data };
};
