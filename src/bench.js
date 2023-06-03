const entries = [];

function measure() {

};




measure.prototype.stop = function stop(name ) {
  let stop = performance.now()
let spend = stop - this.startTime;
entries.push({spend, context: this.context})
};

measure.prototype.start = function start(name, context ) {
  if (context)
this.context = context;
this.startTime = performance.now();
};
measure.prototype.print = function print( groupBy = "all") {
  let rows = {};
  for (let entry of entries) {
    if (groupBy === "all") {
      if (!rows[groupBy])
      { 
        rows[groupBy] = {};
        rows[groupBy]["timeSpend"] = 0;
      }      
      rows[groupBy]["timeSpend"] += entry.spend;
    } else {
      let groupName = entry.meta[groupBy];
      if (!rows[groupName]){
        rows[groupName] = {};
        rows[groupName]["timeSpend"] = 0;
      }
      rows[groupName]["timeSpend"] += entry.spend;
    }
  }
  return rows;
};


let instance = new measure();
window.benchmarker = instance
module.exports = instance;