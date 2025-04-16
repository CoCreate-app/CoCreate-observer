function observer(doc) {
	this.index = 0;
	this.configs = new Map();
	this.configByName = new Map();
	this.childList = {
		undefined: [],
		complexSelectors: new Map(),
		tagName: new Map(),
		id: new Map(),
		class: new Map(),
		attribute: new Map()
	};
	this.addedNodes = {
		undefined: [],
		complexSelectors: new Map(),
		tagName: new Map(),
		id: new Map(),
		class: new Map(),
		attribute: new Map()
	};
	this.removedNodes = {
		undefined: [],
		complexSelectors: new Map(),
		tagName: new Map(),
		id: new Map(),
		class: new Map(),
		attribute: new Map()
	};
	this.attributes = {
		undefined: [],
		complexSelectors: new Map(),
		tagName: new Map(),
		id: new Map(),
		class: new Map(),
		attribute: new Map(),
		attributeFilter: new Map()
	};
	this.characterData = {
		undefined: [],
		complexSelectors: new Map(),
		tagName: new Map(),
		id: new Map(),
		class: new Map(),
		attribute: new Map()
	};
	this.unInintNames = new Set();

	const observer = new MutationObserver((mutationsList) => {
		requestAnimationFrame(() => {
			this.processMutations(mutationsList);
		});
	});

	observer.observe(doc, {
		subtree: true,
		childList: true,
		attributes: true,
		attributeOldValue: true,
		characterData: true,
		characterDataOldValue: true
	});
}

/**
 * Initializes the observer with the provided configuration(s).
 *
 * @param {object|object[]} config - The configuration object or an array of configuration objects.
 * @param {string} config.name - The name of the observer.
 * @param {string|string[]} config.types - The MutationObserver type(s) to observe (e.g., 'childList', 'attributes').
 * @param {string[]} config.attributeFilter - The attributes to observe (only used for 'attributes' mutations).
 * @param {string} config.selector - The CSS selector to target elements.
 * @param {function} config.callback - The callback function to execute when mutations occur.
 * @returns {void}
 */
observer.prototype.init = function (config) {
	if (!Array.isArray(config)) {
		config = [config];
	}

	for (const conf of config) {
		if (!conf.types || !conf.types.length || !conf.callback) {
			console.error(
				"Invalid observer configuration: Missing types or callback."
			);
			return;
		}

		conf.id = "cbId" + ++this.index;

		if (!Array.isArray(conf.types)) {
			conf.types = [conf.types];
		}

		this.configs.set(conf.id, conf);
		if (conf.name) {
			this.configByName.set(conf.name, conf);
		}

		if (conf.selector) {
			conf.generatedIds = [];
			this.parseSelector(conf);
		} else {
			conf.types.forEach((type) => {
				this[type].undefined.push(conf);
			});
		}

		if (conf.types.includes("attributes")) {
			let attributeFilter = conf.attributeFilter;
			if (!attributeFilter || !attributeFilter.length) {
				attributeFilter = [""];
			}

			let targetMap = this.attributes.attributeFilter;
			for (let i = 0; i < attributeFilter.length; i++) {
				const attributeName = attributeFilter[i];
				if (!targetMap.has(attributeName)) {
					targetMap.set(attributeName, [conf.id]);
				} else {
					targetMap.get(attributeName).push(conf.id);
				}
			}
		}
	}
};

observer.prototype.parseSelector = function (config) {
	let complexSelector = "";
	let compoundSelectors = [];

	let selectorIncrement = 0;
	const selectors = config.selector.split(/,(?![^(]*\))/g);
	for (let selector of selectors) {
		selector = selector.trim();
		const parts = [];
		// if (selector.endsWith("[]"))//
		// if (!mutation.target.matches(selector.slice(0, -2)))

		if (this.isComplexSelector(selector)) {
			// Store for matches() handling
			complexSelector += selector + ",";
		} else {
			// ToDo: potentially handle complex selectors by geting the selector that targets the element inorder to check for initial matches prior to running match()

			// const selectorObject = {
			// 	id: [],
			// 	count: 0
			// }

			// if (this.isComplexSelector(selector)) {
			// 	// only apply if match is required
			// 	selectorObject.selector = selector;
			// 	selector = parseComplexSelector(selector);
			// }

			// Parse compound selector
			const regex = /^(\w+)?(#[\w-]+)?((?:\.[\w-]+)*)(\[[^\]]+\])?$/;
			const match = regex.exec(selector);

			if (!match) {
				parts.push({ type: "tagName", name: selector });
			} else {
				if (match[1]) {
					parts.push({ type: "tagName", name: match[1] });
				}

				if (match[2]) {
					parts.push({ type: "id", name: match[2].substring(1) });
				}

				if (match[3]) {
					const classStrings = match[3].split(".");
					for (let i = 1; i < classStrings.length; i++) {
						parts.push({
							type: "class",
							name: classStrings[i]
						});
					}
				}
				if (match[4]) {
					const attributeStrings = match[4].split("[");
					for (let i = 1; i < attributeStrings.length; i++) {
						parts.push({
							type: "attribute",
							name: attributeStrings[i].substring(
								0,
								attributeStrings[i].length - 1
							)
						});
					}
				}
			}
			const generatedId = `${selectorIncrement++}-${config.id}-${
				parts.length
			}`;

			config.generatedIds.push(generatedId);
			compoundSelectors.push({ generatedId, parts });
		}
	}

	for (const observerType of config.types) {
		let targetMap = this[observerType];

		if (complexSelector) {
			const selectorString = complexSelector.slice(0, -1);
			if (!targetMap.complexSelectors.has(selectorString)) {
				targetMap.complexSelectors.set(selectorString, [config.id]);
			} else {
				targetMap.complexSelectors.get(selectorString).push(config.id);
			}
		}

		for (let compoundSelector of compoundSelectors) {
			let generatedId = compoundSelector.generatedId;
			let parts = compoundSelector.parts;
			for (let part of parts) {
				if (!targetMap[part.type].has(part.name)) {
					targetMap[part.type].set(part.name, [generatedId]);
				} else {
					targetMap[part.type].get(part.name).push(generatedId);
				}
			}
		}
	}
};

observer.prototype.isComplexSelector = function (selector) {
	const combinedRegex = /[\s>~+:](?![^\[]*\])|\[[^\]]*[~|^$*]=/g;
	return combinedRegex.test(selector);
};

function parseComplexSelector(selector) {
	// Remove :not(...) and :has(...)
	selector = selector
		.replace(/:(not|has)\([^)]*\)/g, "")
		.replaceAll(")", "")
		.trim();

	// Split the selector by spaces
	const parts = selector.split(" ");

	// Get the last part
	let lastPart = parts.pop();

	// Check if the last part contains a pseudo-class or pseudo-element
	const colonIndex = lastPart.indexOf(":");

	if (colonIndex === -1) {
		// No pseudo-class/element, return the last part as is
		return lastPart;
	} else {
		// Return the part before the first colon
		return lastPart.substring(0, colonIndex) || "";
	}
}

observer.prototype.processMutations = function (mutationsList) {
	const createMutation = (node, mutation, type) => {
		return {
			type: type,
			target: node,
			mutationOrigin: mutation.target,
			parentElement: node.parentElement,
			previousSibling: node.previousSibling,
			nextSibling: node.nextSibling
		};
	};

	for (const mutation of mutationsList) {
		switch (mutation.type) {
			case "childList":
				this.executeCallbacks(mutation);
				if (mutation.addedNodes.length > 0) {
					for (const addedNode of mutation.addedNodes) {
						if (addedNode instanceof Element) {
							let mutationObject = createMutation(
								addedNode,
								mutation,
								"addedNodes"
							);

							let movedFrom = addedNode.movedFrom;
							if (movedFrom) {
								delete addedNode.movedFrom;
								mutationObject.movedFrom = movedFrom;
							}
							this.everyElement(addedNode, (el) => {
								this.executeCallbacks(
									createMutation(el, mutation, "addedNodes")
								);
							});
						}
					}
				}
				if (mutation.removedNodes.length > 0) {
					let movedFrom = {
						parentElement: mutation.target,
						previousSibling: mutation.previousSibling,
						nextSibling: mutation.nextSibling
					};
					for (const removedNode of mutation.removedNodes) {
						if (removedNode instanceof Element) {
							removedNode.movedFrom = movedFrom;
							this.everyElement(removedNode, (el) => {
								this.executeCallbacks(
									createMutation(el, mutation, "removedNodes")
								);
							});
						}
					}
				}
				break;
			case "attributes":
				this.executeCallbacks(mutation);
				break;

			case "characterData":
				if (mutation.target.isConnected) {
					this.executeCallbacks(mutation);
				}
				break;
		}
	}
};

observer.prototype.everyElement = function everyElement(el, callback) {
	const stack = [el];

	while (stack.length > 0) {
		const currentNode = stack.pop();

		callback(currentNode);

		if (currentNode.children.length) {
			const children = currentNode.children;
			for (let i = children.length - 1; i >= 0; i--) {
				stack.push(children[i]);
			}
		}
	}
};

observer.prototype.executeCallbacks = function (mutation) {
	let target = mutation.target; //
	if (target && target.nodeType !== Node.ELEMENT_NODE) {
		target = target.parentElement;
		if (target && target.nodeType !== Node.ELEMENT_NODE) {
			return;
		}
	}

	const targetMap = this[mutation.type];
	const tag = target.tagName && target.tagName.toLowerCase();
	const id = target.id;
	const classes = target.classList;
	const attributes = target.attributes;
	const attributeCallbackIds = [];

	if (mutation.type === "attributes") {
		attributeCallbackIds.push(
			...new Set([
				...(targetMap.attributeFilter.get(mutation.attributeName) ||
					[]),
				...(targetMap.attributeFilter.get("") || [])
			])
		);
		if (!attributeCallbackIds.length) {
			return;
		}
	}

	const matchingCallbackIds = [];

	// Collect matching callback IDs.
	if (tag && targetMap.tagName.has(tag)) {
		matchingCallbackIds.push(...targetMap.tagName.get(tag));
	}
	if (id && targetMap.id.has(id)) {
		matchingCallbackIds.push(...targetMap.id.get(id));
	}

	if (classes) {
		for (const className of classes) {
			if (targetMap.class.has(className)) {
				matchingCallbackIds.push(...targetMap.class.get(className));
			}
		}
	}

	if (attributes) {
		for (const attr of Array.from(attributes)) {
			const attrStringName = attr.name;
			const attrStringNameValue = `${attr.name}="${attr.value}"`;

			if (targetMap.attribute.has(attrStringName)) {
				matchingCallbackIds.push(
					...targetMap.attribute.get(attrStringName)
				);
			}
			if (targetMap.attribute.has(attrStringNameValue)) {
				matchingCallbackIds.push(
					...targetMap.attribute.get(attrStringNameValue)
				);
			}
		}
	}

	const executedConfigIds = new Set(); // Track executed config IDs

	// Execute callbacks for 'undefined' selectors (Fastest)
	const undefinedConfigs = targetMap.undefined; //
	if (undefinedConfigs) {
		for (const config of undefinedConfigs) {
			if (
				mutation.type === "attributes" &&
				!attributeCallbackIds.includes(config.id)
			)
				continue;

			executedConfigIds.add(config.id);
			config.callback(mutation);
		}
	}

	const callbackCounts = {};

	// Count callback occurrences
	for (const matchingCallbackId of matchingCallbackIds) {
		callbackCounts[matchingCallbackId] =
			(callbackCounts[matchingCallbackId] || 0) + 1;
	}

	// Execute callbacks for selector-based matches (Medium)
	for (const id in callbackCounts) {
		const idParts = id.split("-");
		if (
			executedConfigIds.has(idParts[1]) ||
			(mutation.type === "attributes" &&
				!attributeCallbackIds.includes(idParts[1]))
		) {
			continue;
		}

		const partsCount = parseInt(idParts[2]);
		if (callbackCounts[id] === partsCount) {
			const config = this.configs.get(idParts[1]);
			if (config) {
				executedConfigIds.add(config.id);
				config.callback(mutation);
			}
		}
	}

	// Execute callbacks for complex selectors (Slowest)
	const complexSelectors = targetMap.complexSelectors;
	if (complexSelectors) {
		for (const [selector, configIds] of complexSelectors) {
			for (const configId of configIds) {
				if (
					executedConfigIds.has(configId) ||
					(mutation.type === "attributes" &&
						!attributeCallbackIds.includes(configId))
				) {
					continue;
				}

				if (target.matches(selector)) {
					const config = this.configs.get(configId);
					if (config) {
						config.callback(mutation);
					}
				}
			}
		}
	}
};

observer.prototype.uninit = function (name) {
	const config = this.configByName.get(name);
	if (!config) {
		return;
	}

	this.unInintNames.add(name);
	this.configs.delete(config.id);

	clearTimeout(this.debounceTimer);
	this.debounceTimer = setTimeout(() => {
		this.debounceTimer = null;
		this.removeObserver();
	}, 1000);
};

observer.prototype.removeObserver = function () {
	const namesToRemove = Array.from(this.unInintNames);
	this.unInintNames.clear();

	for (let observerName of namesToRemove) {
		let config = this.configByName.get(observerName);

		for (let type of config.types) {
			let targetMap = this[type];
			for (let partType of Object.keys(targetMap)) {
				let selectorMap = targetMap[partType];
				if (Array.isArray(selectorMap)) {
					const index = selectorMap.findIndex(
						(obj) => obj.id === config.id
					);
					if (index !== -1) {
						selectorMap.splice(index, 1);
					}
				} else {
					for (const [key, value] of selectorMap.entries()) {
						if (
							partType === "complexSelector" ||
							partType === "attributeFilter"
						) {
							const index = value.indexOf(config.id);
							if (index !== -1) {
								value.splice(index, 1);
								if (value.length === 0) {
									selectorMap.delete(key);
								}
							}
						} else {
							for (const generatedId of config.generatedIds ||
								[]) {
								const index = value.indexOf(generatedId);
								if (index !== -1) {
									value.splice(index, 1);
									if (value.length === 0) {
										selectorMap.delete(key);
									}
								}
							}
						}
					}
				}
			}
		}
		this.configByName.delete(observerName);
	}
};

export default new observer(document);
