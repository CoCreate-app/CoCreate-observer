// window.addEventListener("load", () => {

/*
CoCreate.observer.init({ 
	name: 'CoCreateFetchInit', // no usage, just to provide for console debugging 
	observe: ['subtree', 'childList','attributes'], // the same parameters of options in #https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
	attributes: ['data-fetch_collection'], // it doesn't count added nodes or remove nodes
	include: ".classname", // a selector to select only elements that matches
	exclude: ".classname", // a selector to exclude elements from processing
	callback: function(mutation) { // a function which gets a mutation object according to #https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
		CoCreateFetch.initElement(mutation.target)
	}
})
*/


/**
 * description
 * 
 * @param {String} [name] - an optional name to provide for debugging console
 * @param {Array} observe - a list of mutation type to be observerd, a mix of possible `attributes`, `childList` or `subtree`
 * ... and other params can be here 
 * 
 * @return null
 */
window.profiler = {}
window.counter = 0;
window.counter2 = 0;
window.targets = {};
window.attributeName = {};
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.matchesSelector ||
    Element.prototype.mozMatchesSelector ||
    Element.prototype.msMatchesSelector ||
    Element.prototype.oMatchesSelector ||
    Element.prototype.webkitMatchesSelector ||
    function(s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
}

const CoCreateObserver = {
  initTasks: new Map(),
  attrTasks: new Map(),
  rules: new Map(),
  rulesArray: [],

  __init: function() {
    const self = this;
    const observer = new MutationObserver((mutationsList, observer) => self.__callback(mutationsList, observer));

    // setTimeout(()=>{
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: false,
      attributeOldValue: true,
      characterData: true,
    });
  },

  // init: function(data) {
  //   this.add(data);
  // },

  init: function({ observe, include, exclude, attributes, name, callback }) {
    console.log(' aaaaaaaaaaaaaa observer init ', name)

    // if (name == 'ccAttribute' || name == 'ccCss') {
    if (observe.some(x => x == "childList")) {
      this.initTasks.set(callback, { observe, include, exclude, attributes, name });
    }

    if (observe.some(x => x == "attributes")) {
      this.attrTasks.set(callback, { observe, include, exclude, attributes, name });
    }
    // }

  },
  remove: function(callback) {
    this.initTasks.delete(callback)
    this.attrTasks.delete(callback)
  },

  addRule: function({ include, exclude, name }) {
    this.rules.set(name, { include, exclude });
    this.rulesArray = Array.from(this.rules);
  },

  removeRule: function({ name }) {
    this.rules.delete(name);
    this.rulesArray = Array.from(this.rules);
  },

  __callback: function(mutationsList, observer) {
    // console.log(this)
    window.counter++;
    for (let mutation of mutationsList) {
      if (mutation.type == "childList" && mutation.addedNodes.length  || mutation.removedNodes.length) {
        //. run init functions
        this.__initCallback(mutation)
      }

      if (mutation.type == "attributes") {
        //. run attributes functions
        this.__attrCallback(mutation);
      }
    }
  },

  __initCallback: function(mutation) {

    this.initTasks.forEach(({ observe, include, exclude, attributes, name }, callback) => {

      mutation.removedNodes.forEach((el) => {
        if (!el.tagName) return;

        if (include && !(el.matches(include) || el.querySelector(include))) {
          return;
        }
        if (exclude && (el.matches(exclude) || el.querySelector(exclude))) {
          return;
        }

        callback.apply(null, [{ type: mutation.type, target: el, isRemoved: true }]);
      })

      mutation.addedNodes.forEach((el) => {
        if (!el.tagName) return;

        if (include && !(el.matches(include) || el.querySelector(include))) {
          return
        }
        if (exclude && (el.matches(exclude) || el.querySelector(exclude))) {
          return;
        }

        callback.apply(null, [{ type: mutation.type, target: el, isRemoved: false }]);
      })





    });

    // addedNodes.map(el => el.created = true);
  },

  __attrCallback: function(mutation) {
    for (let [name, { include, exclude }] of this.rulesArray) {
      if (include && !mutation.target.matches(include)) return;
      if (exclude && mutation.target.matches(exclude)) return;
    }
    this.attrTasks.forEach(({ observe, include, exclude, attributes, name }, callback) => {
      if (attributes && mutation.attributeName && !attributes.includes(mutation.attributeName)) {
        return;
      }
      if (include && !mutation.target.matches(include)) return;
      if (exclude && mutation.target.matches(exclude)) return;

      if (mutation.attributeName) {
        let newValue = mutation.target.getAttribute(mutation.attributeName);
        if (newValue != mutation.oldValue) {
          // window.counter2++;
          // window.profiler[name] = window.profiler[name] != undefined ? window.profiler[name] + 1 : 0;
          // window.targets[mutation.target.id || mutation.target.tagName] =
          //   window.targets[mutation.target.id || mutation.target.tagName] != undefined ?
          //   window.targets[mutation.target.id || mutation.target.tagName] + 1 :
          //   0;

          // window.attributeName[mutation.attributeName] =
          //   window.attributeName[mutation.attributeName] != undefined ?
          //   window.attributeName[mutation.attributeName] + 1 :
          //   0;
          callback.apply(null, [mutation]);
        }
      }

    })
  },

  setInitialized: function(element, type) {
    // element.setAttribute(`initialized_${type}`, "true");
    type = type || "";
    let key = "co_initialized_" + type;
    element[key] = true;
  },

  getInitialized: function(element, type) {
    type = type || "";
    let key = "co_initialized_" + type;
    if (!element[key]) {
      return false;
    }
    else {
      return true;
    }
  }
}

CoCreateObserver.__init();


export default CoCreateObserver;
