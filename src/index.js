// TODO: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll
import parseSelector from "./parseSelector";
let benchmarker = require("./bench");
let dummyEl = document.createElement('div')


let selChunkNameList = ["id", "class", "attribute", "tagName"];

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
    this.name = name;
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

                        this.registerObserve(attributesTarget[att], target, callback);
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
        let selectors = []
        if (target.includes("(")) {
            let selector = target.split("),").map((i) => i.trim());
            for (let i = 0; i < selector.length; i++) {

                let select = selector[i].split("(").map((i) => i.trim());
                if (select.length > 1) {
                    let sel = select[0].split(',').map((i) => i.trim());
                    if (sel.length > 1) {
                        let lastItem = sel.pop();
                        lastItem = lastItem + "(" + select[1]
                        selectors.push(...sel, lastItem)
                    } else {
                        let test = sel[0] + "(" + select[1]
                        selectors.push(test)
                    }
                }
            }

        } else
            selectors = target.split(",").map((i) => i.trim());

        // let selectors = target.split(",").map((i) => i.trim());
        if (selectors.every(sel => {
            try {
                dummyEl.querySelector(sel)
                return true;
            }
            catch (err) {
                return false;
            }
        }))
            for (let selector of selectors) {
                let callbackId = idName + ++i;
                callbackList[callbackId] = {
                    selector,
                    callback,
                    name: this.name
                };


                register(containerTarget, selector, callbackId)

            }
        else {
            let callbackId = idName + ++i;
            callbackList[callbackId] = {
                selector: target,
                callback,
                name: this.name
            };
            register(containerTarget, target, callbackId)
        }

    }
    else {
        let callbackId = idName + ++i;
        callbackList[callbackId] = {
            callback,
            name: this.name
        };


        Object.assign(containerTarget.undefinedSelector, {
            [callbackId]: "callback"
        })


    }
}


function register(containerTarget, selector, callbackId) {
    let parsedSelectors = parseSelector(selector);
    if (!parsedSelectors)
        return Object.assign(containerTarget.undefinedSelector, {
            [callbackId]: "query"
        })



    let value = parsedSelectors.length <= 1 ? {
        [callbackId]: "callback"
    } : {
        [callbackId]: "query"
    };

    for (let chunkName of parsedSelectors) {


        chunkName.value = chunkName.value || '*';

        createOrAttach(
            containerTarget[chunkName.type],
            chunkName.name,
            chunkName.type === "attribute" ? {
                [chunkName.value]: {
                    ...value
                },
            } : value
        );

    }

}

function removeCallback(obj, id, parent, key) {
    if (obj[id]) {
        delete obj[id];
        if (parent && Object.keys(obj).length === 0) delete parent[key];
    }
    for (let key of Object.keys(obj)) {
        let value = obj[key]
        if (value.constructor.name == "Object") removeCallback(value, id, obj, key);
    }
}

observer.prototype.uninit = function uninit(callback) {

    let callbackId;
    for (let key of Object.keys(callbackList)) {
        let value = callbackList[key]
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
    for (let removedNode of mutation.removedNodes) {
        if (!removedNode.tagName) continue;
        this.everyElement(removedNode, (el) => {
            let callbacks = runMutations(removedNodesTarget, el);
            this.runCallbacks(callbacks, {
                target: el,
                type: "removedNodes"
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
    for (let name of Object.keys(callbacks)) {
        let callbackType = callbacks[name]
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
            for (let cbName of Object.keys(callbacks)) {
                let callbackType = callbacks[cbName]
                createOrAttach(addCallbacks, cbName, {});
                addCallbacks[cbName]["callbackType"] = callbackType;
                createOrPush(addCallbacks[cbName], "elements", el);
            }
        });
    }

    for (let cbName of Object.keys(addCallbacks)) {
        let prop = addCallbacks[cbName]
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
    }
    else {
        return true;
    }
};

export default new observer(document.documentElement);
