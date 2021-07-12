// todo: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll
import parseSelector from "./parseSelector";

let selChunkNameList = ["id", "class", "attribute", "tagName"];

let callbackList = {};

let childListTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
};

let characterTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
};

let attributesTarget = {
  undefinedAttribute: {
    tagName: {},
    id: {},
    attribute: {},
    class: {},
  },
};

let addedNodesTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
};
let removedNodesTarget = {
  tagName: {},
  id: {},
  attribute: {},
  class: {},
};

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
}) {
  if (!observe || !observe.every((i) => validObserve.includes(i)))
    throw "please enter a valid observe";
  // only childList
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
              };

            // attributesTarget[att][callbackId] = {
            //   attributeName: att,
            //   callback,
            // };

            // createOrAttach(attributesTarget[att]["attribute"], att, {
            //   [undefined]: { [callbackId]: "callback" },
            // });

            this.registerObserve(attributesTarget[att], target, callback);
          }
        } else
          this.registerObserve(
            attributesTarget["undefinedAttribute"],
            target,
            callback
          );
        break;
      case "childList":
        // console.log(childListTarget);
        this.registerObserve(childListTarget, target, callback);
        break;

      case "addedNodes":
        this.registerObserve(addedNodesTarget, target, callback);
        break;
      case "removedNodes":
        this.registerObserve(removedNodesTarget, target, callback);
        break;
      // case "characterData":
      //   this.registerObserve(characterTarget, target, callback);
      //   break;

      default:
        break;
    }
  }
};

observer.prototype.registerObserve = function registerObserve(
  containerTarget,
  target,
  callback
) {
  if (target) {
    let selectors = target.split(",").map((i) => i.trim());
    for (let selector of selectors) {
      let callbackId = idName + ++i;
      callbackList[callbackId] = {
        selector,
        callback,
      };

      let parsed = parseSelector(selector);

      for (let chunkName of selChunkNameList) {
        let find = parsed.find((i) => i.type === chunkName);
        if (find) {
          if (find.type === "attribute") {
            createOrAttach(containerTarget[find.type], find.name, {
              [find.value]: {
                ...(parsed.length <= 1
                  ? { [callbackId]: "callback" }
                  : { [callbackId]: "query" }),
              },
            });
          } else {
            createOrAttach(
              containerTarget[find.type],
              find.name,
              parsed.length <= 1
                ? { [callbackId]: "callback" }
                : { [callbackId]: "query" }
            );
          }
        } else {
          createOrAttach(
            containerTarget[chunkName],
            "undefinedSelector",
            parsed.length <= 1
              ? { [callbackId]: "callback" }
              : { [callbackId]: "query" }
          );
        }
      }
    }
  } else {
    let callbackId = idName + ++i;
    callbackList[callbackId] = {
      callback,
    };
    for (let chunkName of selChunkNameList) {
      createOrAttach(containerTarget[chunkName], "undefinedSelector", {
        [callbackId]: "callback",
      });
    }
  }
};

observer.prototype.uninit = function uninit(callback) {
  // unattach callback parent if callback.length == 0
};

observer.prototype._callback = function _callback(mutationsList) {
  for (let mutation of mutationsList) {
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
  }
};

observer.prototype.handleAddedNodes = function handleAddedNodes(mutation) {
  for (let addedNode of mutation.addedNodes) {
    if (!addedNode.tagName) continue;
    this.everyElement(addedNode, (el) => {
      let callbacks = runMutations(addedNodesTarget, el);
      this.runCallbacks(callbacks, { target: el, type: "addedNodes" });
    });
  }
};

observer.prototype.handleRemovedNodes = function handleRemovedNodes(mutation) {
  for (let addedNode of mutation.addedNodes) {
    if (!addedNode.tagName) continue;
    this.everyElement(addedNode, (el) => {
      let callbacks = runMutations(removedNodesTarget, el);
      this.runCallbacks(callbacks, { target: el, type: "addedNodes" });
    });
  }
};
observer.prototype.handleAttributes = function handleAttributes(mutation) {
  let container1, container2, callbacks, callbacks2;
  container1 = attributesTarget[mutation.attributeName];
  container2 = attributesTarget["undefinedAttribute"];
  if (container1) callbacks = runMutations(container1, mutation.target);
  callbacks2 = runMutations(container2, mutation.target);
  if (callbacks) callbacks = Object.assign(callbacks, callbacks2);
  else callbacks = callbacks2;

  this.runCallbacks(callbacks, mutation);
};

observer.prototype.runCallbacks = function runCallbacks(callbacks, mutation) {
  for (let [name, callbackType] of Object.entries(callbacks)) {
    let { callback, selector } = callbackList[name];
    if (callbackType === "callback") callback(mutation);
    else if (callbackType === "query" && mutation.target.matches(selector)) {
      callback(mutation);
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
    let { callbackType, elements } = prop;
    let func = callbackList[cbName].callback;
    if (callbackType === "callback") {
      func({ target: mutation.target, type: "childList", addedNodes: elements });
    } else if (callbackType === "query") {
      let selector = callbackList[cbName].selector;

      let matchedEl = [];
      for (let el of elements) {
        if (el.matches(selector)) matchedEl.push(el);
      }
      if (matchedEl.length) func({ target: mutation.target, type: "childList", addedNodes: matchedEl });
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

  let id = el.id || "undefinedSelector";
  if (containerTarget.id[id]) list.push(containerTarget.id[id]);
  else if (containerTarget.id["undefinedSelector"])
    list.push(containerTarget.id["undefinedSelector"]);

  if (containerTarget.tagName[el.tagName])
    list.push(containerTarget.tagName[el.tagName]);
  else if (containerTarget.tagName["undefinedSelector"])
    list.push(containerTarget.tagName["undefinedSelector"]);

  for (let att of el.attributes) {
    let attrName = att.name,
      value = att.value;
    if (containerTarget.attribute[attrName])
      if (containerTarget.attribute[attrName][value])
        list.push(containerTarget.attribute[attrName]);
      else if (containerTarget.attribute[attrName][undefined])
        list.push(containerTarget.attribute[attrName][undefined]);
    if (containerTarget.attribute["undefinedSelector"])
      list.push(containerTarget.attribute["undefinedSelector"]);
  }

  for (let c of el.classList) {
    if (containerTarget.class[c]) list.push(containerTarget.class[c]);
    else if (containerTarget.class["undefinedSelector"])
      list.push(containerTarget.class["undefinedSelector"]);
  }

  return Object.assign.apply(Object, list);
}

observer.prototype.setInitialized = function (element, type) {
  // element.setAttribute(`initialized_${type}`, "true");
  type = type || "";
  let key = "co_initialized_" + type;
  element[key] = true;
};

observer.prototype.getInitialized = function (element, type) {
  type = type || "";
  let key = "co_initialized_" + type;
  if (!element[key]) {
    return false;
  } else {
    return true;
  }
};

export default new observer(document.body);
