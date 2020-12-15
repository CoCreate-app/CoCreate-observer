// window.addEventListener("load", () => {


  window.counter = 0;
  window.counter2 = 0;
  if (!Element.prototype.matches) {
    Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function (s) {
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
    for (let mutation of mutationsList) {
      window.counter++;

      for (let [name, { include, exclude }] of arrayRules) {
        if (include && !mutation.target.matches(include)) return;
        if (exclude && mutation.target.matches(exclude)) return;
      }

      tasks.forEach(
        ({ observe, include, exclude, attributes, name }, callback) => {
          // if(mutation.attributeName == "no-observe") return;
          if (!observe.includes(mutation.type)) return;
          if (
            mutation.attributeName &&
            attributes &&
            !attributes.includes(mutation.attributeName)
          )
            return;
          if (include && !mutation.target.matches(include)) return;
          if (exclude && mutation.target.matches(exclude)) return;
          window.counter2++;
          // console.log('counter 2 :' +  name , mutation.type, mutation.attributeName, mutation.oldValue, window.counter2)
          
          // check old and new value 
          const newValue = mutation.target.getAttribute(mutation.attributeName);
          
          if (mutation.oldValue && newValue != mutation.oldValue) {
            callback.apply(null, [mutation]);
          }
          else if(!mutation.oldValue)
          {
            callback.apply(null, [mutation]);
          }
          
        }
      );
    }
  }
// });
