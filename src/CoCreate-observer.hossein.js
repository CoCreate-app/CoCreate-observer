// window.addEventListener("load", () => {

/*
CoCreateObserver.add({ 
	name: 'CoCreateFetchInit', // no usage, just to provide for console debugging 
	observe: ['subtree', 'childList','attributes'], // the same parameters of options in #https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe
	attributes: ['data-fetch_collection'], // it doesn't count added nodes or remove nodes
	include: ".classname", // a selector to select only elements that matches
	exclude: ".classname", // a selector to exclude elements from processing
	task: function(mutation) { // a function which gets a mutation object according to #https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord
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

window.counter = 0;
window.counter2 = 0;
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

const configInput = {
  attributes: true,
  childList: true,
  subtree: true,
  characterData: false,
  attributeOldValue: true,
  characterData: true,
};

let tasks = new Map();
let rules = new Map();
let arrayRules = [];
var CoCreateObserver = {
  add: function add({ observe, include, exclude, attributes, name, task }) {
    tasks.set(task, { observe, include, exclude, attributes, name });
  },
  remove: function remove({ task }) {
    tasks.delete(task);
  },

  addRule: function addRule({ include, exclude, name }) {
    rules.set(name, { include, exclude });
    arrayRules = Array.from(rules);
  },
  removeRule: function addRule({ name }) {
    rules.delete(name);
    arrayRules = Array.from(rules);
  },
};
window.CoCreateObserver = CoCreateObserver;
const observer = new MutationObserver(callback);
// setTimeout(()=>{
observer.observe(document.body, configInput);

// },5000)

function callback(mutationsList, observer) {
  console.log("mutation event")
  
  for (let mutation of mutationsList) {
    window.counter++;

    for (let [name, { include, exclude }] of arrayRules) {
      if (include && !mutation.target.matches(include)) return;
      if (exclude && mutation.target.matches(exclude)) return;
    }

    tasks.forEach(
      ({ observe, include, exclude, attributes, name }, callback) => {
        // if(mutation.attributeName == "no-observe") return;
        
        //. Added by Jin
        if (!observe.indexOf(mutation.type)) {
          return;
        }
        
        if (
          attributes &&
          mutation.attributeName &&
          !attributes.includes(mutation.attributeName)
        )
          return;
        if (!observe.includes(mutation.type)) return;
        if (mutation.type === 'childList') {
          let addedNodes = Array.from(mutation.addedNodes);
          if (include && !addedNodes.some(el => el.tagName && el.matches(include))) return;
          if (exclude && addedNodes.some(el => el.tagName && el.matches(exclude))) return;
          
          //. added by jin
          if (addedNodes.every(el => el.created)) return;
          callback.apply(null, [mutation]);
          return;
        }
        else {
          if (include && !mutation.target.matches(include)) return;
          if (exclude && mutation.target.matches(exclude)) return;
        }
        window.counter2++;
        // console.log('counter 2 :' +  name , mutation.type, mutation.attributeName, mutation.oldValue, window.counter2)
        let newValue;
        if (mutation.attributeName) {
          newValue = mutation.target.getAttribute(mutation.attributeName);
          if (newValue != mutation.oldValue) {
            callback.apply(null, [mutation]);
          }
        }
      }
    );
    
    //. Added by jin
    let addedNodes = Array.from(mutation.addedNodes);
    addedNodes.map(el => el.created = true);
  }
}
