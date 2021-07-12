function bench(callback, context = null, args) {
  let entries = [];
  let s = performance.now();
  let meta = callback.apply(context, args);
  let e = performance.now();
  entries.push({ s, e, meta });
}

function print(entries, groupBy = "all") {
  let rows = {};
  for (let entry of entries) {
    if (groupBy === "all") {
      if (!rows[groupBy]) rows[groupBy] = {};
      rows[groupBy]["timeSpend"] += entry.e - entry.s;
    } else {
      let groupName = entry[groupBy];
      if (!rows[groupName]) rows[groupName] = {};

      rows[groupName]["timeSpend"] += entry.e - entry.s;
    }
  }
}

module.exports = { bench, print };
