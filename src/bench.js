window.entries = [];
window.bench = {};
window.bench.measure = function measure(callback, context = null, args) {
  let s = performance.now();
  let meta = callback.apply(context, args);
  let e = performance.now();
  entries.push({ s, e, meta });
};

window.bench.print = function print(entries, groupBy = "all") {
  let rows = {};
  for (let entry of entries) {
    if (groupBy === "all") {
      if (!rows[groupBy]) rows[groupBy] = {};
      rows[groupBy]["timeSpend"] = 0;
      rows[groupBy]["timeSpend"] += entry.e - entry.s;
    } else {
      let groupName = entry.meta[groupBy];
      if (!rows[groupName]) rows[groupName] = {};
      rows[groupName]["timeSpend"] = 0;
      rows[groupName]["timeSpend"] += entry.e - entry.s;
    }
  }
  return rows;
};
