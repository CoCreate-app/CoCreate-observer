// TODO: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll
import parseSelector from "./parseSelector";
let benchmarker = require("./bench");
let dummyEl = document.createElement("div");

let idName = "cbId";
let i = 0;

function observer(doc) {
	this.callbackList = {};

	this.childListTarget = {
		tagName: {},
		id: {},
		attribute: {},
		class: {},
		undefinedSelector: {}
	};

	this.characterTarget = {
		tagName: {},
		id: {},
		attribute: {},
		class: {},
		undefinedSelector: {}
	};

	this.attributesTarget = {
		undefinedAttribute: {
			tagName: {},
			id: {},
			attribute: {},
			class: {},
			undefinedSelector: {}
		}
	};

	this.addedNodesTarget = {
		tagName: {},
		id: {},
		attribute: {},
		class: {},
		undefinedSelector: {}
	};

	this.removedNodesTarget = {
		tagName: {},
		id: {},
		attribute: {},
		class: {},
		undefinedSelector: {}
	};

	const observer = new MutationObserver((mutationsList) =>
		this._callback.call(this, mutationsList)
	);

	observer.observe(doc, {
		subtree: true, // observers all children and children of children
		childList: true, // observes when elements are added and removed
		attributes: true, // observers all children and children of children
		attributeOldValue: true,
		characterData: true, // observes innerText change
		characterDataOldValue: true
	});
}

const validObserve = [
	"addedNodes",
	"removedNodes",
	"attributes",
	"characterData",
	"childList"
];

observer.prototype.init = function init({
	observe,
	attributeName,
	target,
	selector,
	callback,
	name
}) {
	if (!observe || !observe.every((i) => validObserve.includes(i)))
		return console.error("please enter a valid observe");

	for (let observeType of observe) {
		switch (observeType) {
			case "attributes":
				if (attributeName) {
					for (let att of attributeName) {
						if (!this.attributesTarget[att])
							this.attributesTarget[att] = {
								tagName: {},
								id: {},
								attribute: {},
								class: {},
								undefinedSelector: {}
							};

						this.registerObserve(
							name,
							this.attributesTarget[att],
							selector,
							callback
						);
					}
				} else
					this.registerObserve(
						name,
						this.attributesTarget["undefinedAttribute"],
						selector,
						callback
					);
				break;
			case "childList":
				this.registerObserve(
					name,
					this.childListTarget,
					selector,
					callback
				);
				break;

			case "addedNodes":
				this.registerObserve(
					name,
					this.addedNodesTarget,
					selector,
					callback
				);
				break;
			case "removedNodes":
				this.registerObserve(
					name,
					this.removedNodesTarget,
					selector,
					callback
				);
				break;
			case "characterData":
				this.registerObserve(
					name,
					this.characterTarget,
					selector,
					callback
				);
				break;

			default:
				break;
		}
	}
};

observer.prototype.registerObserve = function registerObserve(
	name,
	containerTarget,
	selector,
	callback
) {
	if (selector) {
		let selectors = [];
		if (selector.includes("(")) {
			let selectorArray = selector.split("),").map((i) => i.trim());
			for (let i = 0; i < selectorArray.length; i++) {
				let select = selectorArray[i].split("(").map((i) => i.trim());
				if (select.length > 1) {
					let sel = select[0].split(",").map((i) => i.trim());
					if (sel.length > 1) {
						let lastItem = sel.pop();
						lastItem = lastItem + "(" + select[1];
						selectors.push(...sel, lastItem);
					} else {
						let test = sel[0] + "(" + select[1];
						selectors.push(test);
					}
				}
			}
		} else selectors = selector.split(",").map((i) => i.trim());

		if (
			selectors.every((sel) => {
				try {
					dummyEl.querySelector(sel);
					return true;
				} catch (err) {
					return false;
				}
			})
		) {
			for (let sel of selectors) {
				let callbackId = idName + ++i;
				this.callbackList[callbackId] = {
					selector: sel,
					callback,
					name
				};

				register(containerTarget, sel, callbackId);
			}
		} else {
			let callbackId = idName + ++i;
			this.callbackList[callbackId] = {
				selector,
				callback,
				name
			};
			register(containerTarget, selector, callbackId);
		}
	} else {
		let callbackId = idName + ++i;
		this.callbackList[callbackId] = {
			callback,
			name
		};

		Object.assign(containerTarget.undefinedSelector, {
			[callbackId]: "callback"
		});
	}
};

function register(containerTarget, selector, callbackId) {
	let parsedSelectors = parseSelector(selector);
	if (!parsedSelectors)
		return Object.assign(containerTarget.undefinedSelector, {
			[callbackId]: "query"
		});

	let value =
		parsedSelectors.length <= 1
			? {
					[callbackId]: "callback"
			  }
			: {
					[callbackId]: "query"
			  };

	for (let chunkName of parsedSelectors) {
		chunkName.value = chunkName.value || "*";

		createOrAttach(
			containerTarget[chunkName.type],
			chunkName.name,
			chunkName.type === "attribute"
				? {
						[chunkName.value]: {
							...value
						}
				  }
				: value
		);
	}
}

function removeCallback(obj, id, parent, key) {
	if (obj[id]) {
		delete obj[id];
		if (parent && Object.keys(obj).length === 0) {
			if (key !== "undefinedSelector") delete parent[key];
		}
	}
	for (let key of Object.keys(obj)) {
		let value = obj[key];
		if (value.constructor.name == "Object")
			removeCallback(value, id, obj, key);
	}
}

observer.prototype.uninit = function uninit(callback) {
	let callbackId;
	for (let key of Object.keys(this.callbackList)) {
		let value = this.callbackList[key];
		if (value.callback === callback) {
			callbackId = key;
			break;
		}
	}
	if (callbackId) {
		let allCallbacks = {
			childListTarget: this.childListTarget,
			characterTarget: this.characterTarget,
			attributesTarget: this.attributesTarget,
			addedNodesTarget: this.addedNodesTarget,
			removedNodesTarget: this.removedNodesTarget
		};
		removeCallback(allCallbacks, callbackId);
		delete this.callbackList[callbackId];
	}
	// unattach callback parent if callback.length == 0
};

observer.prototype._callback = function _callback(mutationsList) {
	for (let mutation of mutationsList) {
		benchmarker.start("mutation", mutation);

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
		benchmarker.stop("mutation");
	}
};

observer.prototype.handleAddedNodes = function handleAddedNodes(mutation) {
	for (let addedNode of mutation.addedNodes) {
		if (!addedNode.tagName) continue;
		this.everyElement(addedNode, (el) => {
			let movedFrom = el.movedFrom;
			if (movedFrom) {
				delete el.movedFrom;
			}

			let callbacks = runMutations(this.addedNodesTarget, el);
			this.runCallbacks(callbacks, {
				target: el,
				type: "addedNodes",
				parentElement: mutation.target,
				previousSibling: mutation.previousSibling,
				nextSibling: mutation.nextSibling,
				movedFrom
			});
		});
	}
};

observer.prototype.handleRemovedNodes = function handleRemovedNodes(mutation) {
	for (let removedNode of mutation.removedNodes) {
		if (!removedNode.tagName) continue;
		this.everyElement(removedNode, (el) => {
			if (el.parentElement)
				el.movedFrom = {
					parentElement: mutation.target,
					previousSibling: mutation.previousSibling,
					nextSibling: mutation.nextSibling
				};

			let callbacks = runMutations(this.removedNodesTarget, el);
			this.runCallbacks(callbacks, {
				target: el,
				type: "removedNodes",
				parentElement: mutation.target,
				previousSibling: mutation.previousSibling,
				nextSibling: mutation.nextSibling
			});
		});
	}
};

observer.prototype.handleAttributes = function handleAttributes(mutation) {
	let container = this.attributesTarget[mutation.attributeName];
	if (container) {
		let callbacks = runMutations(container, mutation.target);
		this.runCallbacks(callbacks, mutation);
	}

	container = this.attributesTarget["undefinedAttribute"];
	if (container) {
		let callbacks = runMutations(container, mutation.target);
		this.runCallbacks(callbacks, mutation);
	}
};

observer.prototype.runCallbacks = function runCallbacks(callbacks, mutation) {
	for (let name of Object.keys(callbacks)) {
		let callbackType = callbacks[name];
		if (this.callbackList[name]) {
			let { callback, selector } = this.callbackList[name];
			if (callbackType === "callback") {
				benchmarker.stop("mutation");
				callback(mutation);
				benchmarker.start("mutation");
			} else if (callbackType === "query") {
				if (selector.endsWith("[]")) {
					if (!mutation.target.matches(selector.slice(0, -2)))
						continue;
				} else if (!mutation.target.matches(selector)) continue;
				benchmarker.stop("mutation");
				callback(mutation);
				benchmarker.start("mutation");
			}
		}
	}
};

observer.prototype.handleCharacterData = function handleCharacterData(
	mutation
) {
	let callbacks = runMutations(
		this.characterTarget,
		mutation.target.parentElement
	);

	this.runCallbacks(callbacks, mutation);
};

observer.prototype.handleChildList = function handleChildList(mutation) {
	let addCallbacks = {};
	for (let addedNode of mutation.addedNodes) {
		if (!addedNode.tagName) continue;
		this.everyElement(addedNode, (el) => {
			let callbacks = runMutations(this.childListTarget, el);
			for (let cbName of Object.keys(callbacks)) {
				let callbackType = callbacks[cbName];
				createOrAttach(addCallbacks, cbName, {});
				addCallbacks[cbName]["callbackType"] = callbackType;
				createOrPush(addCallbacks[cbName], "elements", el);
			}
		});
	}

	for (let cbName of Object.keys(addCallbacks)) {
		let prop = addCallbacks[cbName];
		let { callbackType, elements } = prop;
		if (!this.callbackList[cbName]) continue;
		let func = this.callbackList[cbName].callback;
		if (callbackType === "callback") {
			benchmarker.stop("mutation");
			func({
				target: mutation.target,
				type: "childList",
				addedNodes: elements
			});
			benchmarker.start("mutation");
		} else if (callbackType === "query") {
			let selector = this.callbackList[cbName].selector;

			let matchedEl = [];
			for (let el of elements) {
				if (selector.endsWith("[]")) {
					if (el.matches(selector.slice(0, -2))) matchedEl.push(el);
				} else if (el.matches(selector)) matchedEl.push(el);
			}
			if (matchedEl.length) {
				benchmarker.stop("mutation");

				func({
					target: mutation.target,
					type: "childList",
					addedNodes: matchedEl
				});
				benchmarker.start("mutation");
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
		if (
			containerTarget.attribute[attrName] &&
			containerTarget.attribute[attrName][value]
		)
			list.push(containerTarget.attribute[attrName][value]);
		if (
			containerTarget.attribute[attrName] &&
			containerTarget.attribute[attrName]["*"]
		)
			list.push(containerTarget.attribute[attrName]["*"]);
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
	} else {
		return true;
	}
};

export default new observer(document);
