// todo: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll
import parseSelector from "./parseSelector";
const attitude = {
  newObserver: false, // cause it to create a new mutationObserver when observer is "attribute" and it has attributeFilter
  deepChildList: true, // cause it to go deep when mutation addedNodes and removedNodes receieved
};
// todo: avoid loops mechanism

// todo: have 2 type of init: if no attributesFilter defined save them to all and only run a function that doesn't change attribute filter. and et cetera

// example :
/**
 *     CoCreate.observer.init({
          name: 'vdom', 
          onlyCause: ['CCcss'], // name of ccCss observer.init
          preventFrom: ['ccAttribute'], // name of ccAttribute observer.init
          observe: ['removedNodes','addedNodes'], // , ‘addedNodes’, ‘removedNodes’,’characterData’,
          callback: function(mutation) {
             // do vdom
             
    },
  })
 **/

let priority = {
  tagName: 0,
  id: 1,
  attribute: 2,
  attributeWithValue: 3,
  class: 4,
};

function sortSelectors(selList) {
  return selList.sort((item1, item2) =>
    priority[item1.type] > priority[item2.type] ? 1 : -1
  );
}

window.counter = 0;

// todo: check if order of calling callbacks is irrelevant

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
observer.prototype.init = function init(args) {
  if (!args.observe || !args.observe.every((i) => validObserve.includes(i)))
    throw "please enter a valid observe";

  self = this;
  let param = {
    ...args,
    ...{ selector: args.target && sortSelectors(parseSelector(args.target)) },
  };
  args.observe.forEach((type) => {
    self["_register_" + type].call(self, param);
  });
};
// { observe = ['addedNodes', 'attributes'], attributeFilter, target, callback }
observer.prototype._register_addedNodes = function _register_addedNodes(param) {
  let meta = {
    callback: param.callback,
    selector: param.selector,
    type: "addedNodes",
  };
  this.childListCallback.push(meta);
};
observer.prototype._register_removedNodes = function _register_removedNodes(
  param
) {
  let meta = {
    callback: param.callback,
    selector: param.selector,
    type: "removedNodes",
  };
  this.childListCallback.push(meta);
};
observer.prototype._register_childList = function _register_childList(param) {
  let meta = {
    callback: param.callback,
    selector: param.selector,
    type: "childList",
  };
  this.childListCallback.push(meta);
};
observer.prototype._register_characterData = function _register_characterData(
  param
) {
  let meta = { callback: param.callback, selector: this.selector };
  this.characterDataCallback.push(meta);
};

observer.prototype._register_attributes = function _register_attributes(param) {
  self = this;
  if (attitude.newObserver && param.attributeFilter) {
    const observer = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        self._validateBySelector(mutation.target, param.selector) &&
          param.callback(mutationsList);
      });
    });

    observer.observe(doc, {
      subtree: true, // observers all children and children of children
      childList: false, // observes when elements are added and removed
      attributes: true, // observers all children and children of children
      attributeOldValue: true,
      characterData: false, // observes inntext change
      characterDataOldValue: false,
      attributeFilter: param.attributeFilter,
    });
  }

  let meta = { callback: param.callback, selector: this.selector };
  if (param.attributeFilter)
    param.attributeFilter.forEach((filter) => {
      if (this.attributeCallback[filter])
        this.attributeCallback[filter].push(meta);
      else this.attributeCallback[filter] = [meta];
    });
  else this.attributeCallback["ALL"].push(meta);
};

observer.prototype.uninit = function uninit(callback) {
  // unattach callback parent if callback.length == 0
};

observer.prototype._callback = function _callback(mutationsList) {
  for (let mutation of mutationsList) {
    window.counter++;
    switch (mutation.type) {
      case "attributes":
        this._attributeCallback(mutation);
        break;
      case "characterData":
        this._characterDataCallback(mutation);
        break;

      case "childList":
        this._childList(mutation);
        break;
      default:
    }
  }
};

observer.prototype._validateBySelector = function _validateBySelector(
  element,
  selectors
) {
  return selectors.every((selector) => {
    switch (selector.type) {
      case "tagName":
        return element.tagName === selector.name;
      case "id":
        return element.id === selector.name;
      case "class":
        return element.classList.contains(selector.name);
      case "attribute":
        return element.hasAttributes(selector.name);
      case "attributeWithValue":
        return (
          element.hasAttributes(selector.name) &&
          element.getAttribute(selector.name) === selector.value
        );
      default:
        throw new Error("unidentified selector type");
    }
  });
};

observer.prototype._attributeCallback = function _attributeCallback(mutation) {
  if (!mutation.target.hasAttributes(mutation.attributeName)) return;

  let newValue = mutation.target.getAttribute(mutation.attributeName);

  if (newValue === mutation.oldValue) return;

  this.attributeCallback.ALL.forEach((row) => {
    if (row.selector && this._validateBySelector(mutation.target, row.selector))
      row.callback(mutation);
    else if (!row.selector) row.callback(mutation);
  });

  function filter()
  if (!meta) return;

  meta.forEach((row) => {
    if (row.selector && this._validateBySelector(mutation.target, row.selector))
      row.callback(mutation);
    else if (!row.selector) row.callback(mutation);
  });
};

observer.prototype._characterDataCallback = function _characterDataCallback(
  mutation
) {
  if (mutation.target.data === mutation.oldValue) return;

  this.characterDataCallback.forEach((row) => {
    if (
      row.selector &&
      this._validateBySelector(mutation.target.parentElement, row.selector)
    )
      row.callback(mutation);
    else if (!row.selector) row.callback(mutation);
  });
};

// addedNodes and removedNodes only consist of immediate elements that is added
if (attitude.deepChildList)
  observer.prototype.everyElement = function everyElement(el, callback) {
    callback(el);

    if (el.childNodes)
      for (let node of el.children) this.everyElement(node, callback);
  };
else
  observer.prototype.everyElement = function everyElement(el, callback) {
    callback(el);
  };

// childlist consist of text nodes and no filteration applied on nodes that are type of text
observer.prototype._childList = function _childList(mutation) {
  let addedNodes = Array.from(mutation.addedNodes);
  let removedNodes = Array.from(mutation.removedNodes);
  this.childListCallback.forEach((row) => {
    let addedNodesList = [];
    let removedNodesList = [];
    if (row.type == "childList") {
      if (row.selector) {
        addedNodes.filter((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              if (el.tagName && this._validateBySelector(el, row.selector))
                addedNodesList.push(el);
            });
        });

        removedNodes.filter((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              if (el.tagName && this._validateBySelector(el, row.selector))
                removedNodesList.push(el);
            });
        });
      } else if (!row.selector) {
        addedNodes.forEach((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              addedNodesList.push(el);
            });
        });
        removedNodes.forEach((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              removedNodesList.push(el);
            });
        });
      }

      if (addedNodesList.length || removedNodesList.length)
        row.callback({
          ...mutation,
          addedNodes: addedNodesList,
          removedNodes: removedNodesList,
        });
    } else if (row.type == "addedNodes") {
      if (row.selector)
        addedNodes.forEach((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              if (el.tagName && this._validateBySelector(el, row.selector))
                row.callback({ target: el, type: "addedNodes" });
            });
        });
      else if (!row.selector)
        addedNodes.forEach(
          (el) =>
            el.tagName &&
            this.everyElement(el, (el) => {
              row.callback({ target: el, type: "addedNodes" });
            })
        );
    } else if (row.type == "removedNodes") {
      if (row.selector)
        removedNodes.forEach((el) => {
          el.tagName &&
            this.everyElement(el, (el) => {
              if (el.tagName && this._validateBySelector(el, row.selector))
                row.callback({ target: el, type: "removedNodes" });
            });
        });
      else if (!row.selector)
        removedNodes.forEach(
          (el) =>
            el.tagName &&
            this.everyElement(el, (el) => {
              row.callback({ target: el, type: "removedNodes" });
            })
        );
    }
  });
};

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
