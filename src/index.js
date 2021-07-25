// todo: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll
import parseSelector from "./parseSelector";
const CssSelectorParser = require('css-selector-parser').CssSelectorParser;
const parser = new CssSelectorParser();
parser.registerAttrEqualityMods('^', '$', '*', '~');
let benchmarker = require("./bench");
let dummyEl = document.createElement('div')


let selchunkList = ["id", "class", "attribute", "tagName"];

let callbackList = {};

let childListTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
  undefinedSelector: {}
};

let characterTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
  undefinedSelector: {}
};

let attributesTarget = {
  undefinedAttribute: {
    tagName: {},
    id: {},
    attribute: {},
    class: {},
    undefinedSelector: {}
  },
};

let addedNodesTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
  undefinedSelector: {}
};

let removedNodesTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
  undefinedSelector: {}
};

let allCallbacks = {
  childListTarget,
  characterTarget,
  attributesTarget,
  addedNodesTarget,
  removedNodesTarget
}
window.allCallbacks = allCallbacks;
let idName = "cbId";
let i = 0;

function observer(doc) {
  this.attributeCallback = {};
  this.attributeCallback["ALL"] = [];

  this.childListCallback = [];

  this.characterDataCallback = [];

  const observer = new MutationObserver((mutationsList) =>
    this._callback.call(this, mutationsList)
  );

  observer.observe(doc, {
    subtree: true, // observers all children and children of children
    childList: true, // observes when elements are added and removed
    attributes: true, // observers all children and children of children
    attributeOldValue: true,
    characterData: true, // observes inntext change
    characterDataOldValue: true,
  });
}

const validObserve = [
  "addedNodes",
  "removedNodes",
  "attributes",
  "characterData",
  "childList",
];
observer.prototype.init = function init({
  observe,
  attributeName,
  target,
  callback,
  name
}) {
  if (!observe || !observe.every((i) => validObserve.includes(i)))
    throw "please enter a valid observe";
  this.callback = callback;
  this.attributeName = attributeName;
  let param = {
    target,
    callback,
    attributeName,
    name
  }
  // only childList
  // target += attributeName.map(i => `[${i}]`);
  for (let observeType of observe) {
    switch (observeType) {
      case "attributes":
        if (attributeName) {
          for (let att of attributeName) {
            if (!attributesTarget[att])
              attributesTarget[att] = {
                tagName: {},
                id: {},
                attribute: {},
                class: {},
                undefinedSelector: {}
              };

            this.registerObserve(attributesTarget[att], target);
          }
        }
        else
          this.registerObserve(
            attributesTarget["undefinedAttribute"],
            target,
            callback
          );
        break;
      case "childList":
        // console.log(childListTarget);
        this.registerObserve(childListTarget, target);
        break;

      case "addedNodes":
        this.registerObserve(addedNodesTarget, target);
        break;
      case "removedNodes":
        this.registerObserve(removedNodesTarget, target);
        break;
        // case "characterData":
        //   this.registerObserve(characterTarget,target);
        //   break;

      default:
        break;
    }
  }
};

observer.prototype.registerObserve = function registerObserve(
  containerTarget,
  target
) {

  if (!target) {
    this.register(containerTarget)
  }
  else
    try {
      let parsedSelector = parser.parse(target);




      if (parsedSelector.type == 'selectors')
        for (let ruleSet of parsedSelector.selectors)
          this.register(containerTarget, ruleSet.rule)
      else
        this.register(containerTarget, parsedSelector.rule)

    }
  catch (err) {
    console.error(`can not parse "${target}"`, err);
  }


}
observer.prototype.ruleToStr = function ruleToStr(rule) {
  let str = ''
  if (rule.tagName)
    str += rule.tagName;
  if (rule.id)
    str += '#' + rule.id;
  if (rule.classNames)
    for (let cls of rule.classNames)
      str += '.' + cls;
  if (rule.attrs)
    for (let cls of rule.attrs)
      if (cls.operator)
        str += '[' + cls.name + cls.operator + cls.value + ']';
      else
        str += '[' + cls.name + ']';
  return str;
}
observer.prototype.registerCallbackId = function registerCallbackId(param) {
  let callbackId = idName + ++i;
  callbackList[callbackId] = param;
  return callbackId;
}
observer.prototype.register = function register(containerTarget, rule) {





  if (rule) {
    let {
      count,
      ruleChunks
    } = this.getRules(rule, {
      tagName: 'tagName',
      id: 'id',
      classNames: 'class',
      attrs: 'attribute'
    });
    let selector = this.ruleToStr(rule);
    let callbackId = this.registerCallbackId({
      target: selector,
      callback: this.callback
    })

    if (rule.pseudos || count > 1 || ruleChunks[0].operator && ruleChunks[0].operator != '=')
      return Object.assign(containerTarget.undefinedSelector, {
        [callbackId]: "query"
      })
    else {

      let value = {
        [callbackId]: "callback"
      };
      let chunk = ruleChunks[0]

      chunk.value = chunk.value || '*';

      createOrAttach(
        containerTarget[chunk.type],
        chunk.name,
        chunk.type === "attribute" ? {
          [chunk.value]: {
            ...value
          },
        } : value
      );




    }

  }
  else {
    let callbackId = this.registerCallbackId({
      callback: this.callback
    })
    return Object.assign(containerTarget.undefinedSelector, {
      [callbackId]: "callback"
    })

  }


}



observer.prototype.getRules = function getRules(ruleSet, keys) {
  let ruleChunks = [];
  let count = 0;

  function add(data) {
    count++;
    ruleChunks.push(data);
  }

  for (let [source, dest] of Object.entries(keys))
    if (ruleSet[source]) {
      if (Array.isArray(ruleSet[source]))
        for (let cl of ruleSet[source]) {
          if (typeof cl == 'object')
            add({
              type: dest,
              ...cl
            })


          else
            add({
              type: dest,
              name: cl
            })

        }
      else
        add({
          type: dest,
          name: ruleSet[source]
        })
    }


  return {
    count,
    ruleChunks
  };

}

function removeCallback(obj, id, parent, key) {
  if (obj[id]) {
    delete obj[id];
    if (parent && Object.keys(obj).length === 0) delete parent[key];
  }
  for (let [key, value] of Object.entries(obj))
    if (value.constructor.name == "Object") removeCallback(value, id, obj, key);
}

observer.prototype.uninit = function uninit(callback) {

  let callbackId;
  for (let [key, value] of Object.entries(callbackList)) {
    if (value.callback === callback) {
      callbackId = key;

      break;
    }
  }
  if (callbackId) {
    removeCallback(allCallbacks, callbackId)
    delete callbackList[callbackId];

  }
  // unattach callback parent if callback.length == 0
};

observer.prototype._callback = function _callback(mutationsList) {
  for (let mutation of mutationsList) {
    benchmarker.start('mutation', mutation)

    switch (mutation.type) {
      case "childList":
        this.handleChildList(mutation);
        this.handleAddedNodes(mutation);
        this.handleRemovedNodes(mutation);
        break;
      case "attributes":
        this.handleAttributes(mutation);
        break;
      case "characterData":
        this.handleCharacterData(mutation);
        break;
    }
    benchmarker.stop('mutation')

  }
};

observer.prototype.handleAddedNodes = function handleAddedNodes(mutation) {
  for (let addedNode of mutation.addedNodes) {
    if (!addedNode.tagName) continue;
    this.everyElement(addedNode, (el) => {
      let callbacks = runMutations(addedNodesTarget, el);
      this.runCallbacks(callbacks, {
        target: el,
        type: "addedNodes"
      });
    });
  }
};

observer.prototype.handleRemovedNodes = function handleRemovedNodes(mutation) {
  for (let addedNode of mutation.addedNodes) {
    if (!addedNode.tagName) continue;
    this.everyElement(addedNode, (el) => {
      let callbacks = runMutations(removedNodesTarget, el);
      this.runCallbacks(callbacks, {
        target: el,
        type: "addedNodes"
      });
    });
  }
};
observer.prototype.handleAttributes = function handleAttributes(mutation) {

  let container = attributesTarget[mutation.attributeName];
  if (container) {
    let callbacks = runMutations(container, mutation.target);
    this.runCallbacks(callbacks, mutation);
  }


  container = attributesTarget["undefinedAttribute"];
  if (container) {
    let callbacks = runMutations(container, mutation.target);
    this.runCallbacks(callbacks, mutation);
  }


};

observer.prototype.runCallbacks = function runCallbacks(callbacks, mutation) {
  for (let [name, callbackType] of Object.entries(callbacks)) {
    let {
      callback,
      selector
    } = callbackList[name];
    if (callbackType === "callback") {
      benchmarker.stop('mutation')
      callback(mutation);
      benchmarker.start('mutation')
    }
    else if (callbackType === "query" && mutation.target.matches(selector)) {
      benchmarker.stop('mutation')
      callback(mutation);
      benchmarker.start('mutation')
    }
  }
};

observer.prototype.handleCharacterData = function handleCharacterData(
  mutation
) {
  let callbacks = runMutations(characterTarget, mutation.target.parentElement);

  this.runCallbacks(callbacks, mutation);
};

observer.prototype.handleChildList = function handleChildList(mutation) {
  let addCallbacks = {};
  for (let addedNode of mutation.addedNodes) {
    if (!addedNode.tagName) continue;
    this.everyElement(addedNode, (el) => {
      let callbacks = runMutations(childListTarget, el);
      for (let [cbName, callbackType] of Object.entries(callbacks)) {
        createOrAttach(addCallbacks, cbName, {});
        addCallbacks[cbName]["callbackType"] = callbackType;
        createOrPush(addCallbacks[cbName], "elements", el);
      }
    });
  }

  for (let [cbName, prop] of Object.entries(addCallbacks)) {
    let {
      callbackType,
      elements
    } = prop;
    if (!callbackList[cbName]) continue;
    let func = callbackList[cbName].callback;
    if (callbackType === "callback") {
      benchmarker.stop('mutation')
      func({
        target: mutation.target,
        type: "childList",
        addedNodes: elements,
      });
      benchmarker.start('mutation')
    }
    else if (callbackType === "query") {
      let selector = callbackList[cbName].selector;

      let matchedEl = [];
      for (let el of elements) {
        if (el.matches(selector)) matchedEl.push(el);
      }
      if (matchedEl.length) {
        benchmarker.stop('mutation')


        func({
          target: mutation.target,
          type: "childList",
          addedNodes: matchedEl,
        });
        benchmarker.start('mutation')
      }
    }
  }
};

observer.prototype.everyElement = function everyElement(el, callback) {
  callback(el);

  if (el.children.length)
    for (let node of el.children) this.everyElement(node, callback);
};

function createOrAttach(obj, name, value) {
  if (obj[name]) Object.assign(obj[name], value);
  else obj[name] = value;
}

function createOrPush(obj, name, value) {
  if (obj[name]) obj[name].push(value);
  else obj[name] = [value];
}

function runMutations(containerTarget, el) {
  let list = [{}];


  list.push(containerTarget.undefinedSelector);


  let id = el.id;
  if (containerTarget.id[id]) list.push(containerTarget.id[id]);


  if (containerTarget.tagName[el.tagName])
    list.push(containerTarget.tagName[el.tagName]);


  for (let att of el.attributes) {
    let attrName = att.name,
      value = att.value;
    if (containerTarget.attribute[attrName] && containerTarget.attribute[attrName][value])
      list.push(containerTarget.attribute[attrName][value]);
    if (containerTarget.attribute[attrName] && containerTarget.attribute[attrName]['*'])
      list.push(containerTarget.attribute[attrName]['*']);
  }

  for (let c of el.classList) {
    if (containerTarget.class[c]) list.push(containerTarget.class[c]);
  }

  return Object.assign.apply(Object, list);
}

observer.prototype.setInitialized = function(element, type) {
  // element.setAttribute(`initialized_${type}`, "true");
  type = type || "";
  let key = "co_initialized_" + type;
  element[key] = true;
};

observer.prototype.getInitialized = function(element, type) {
  type = type || "";
  let key = "co_initialized_" + type;
  if (!element[key]) {
    return false;
  }
  else {
    return true;
  }
};

export default new observer(document.body);
