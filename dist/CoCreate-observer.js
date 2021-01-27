(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CoCreateObserver"] = factory();
	else
		root["CoCreateObserver"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/CoCreate-observer.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CoCreate-observer.js":
/*!**********************************!*\
  !*** ./src/CoCreate-observer.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nfunction _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }\n\nfunction _nonIterableRest() { throw new TypeError(\"Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\n\nfunction _iterableToArrayLimit(arr, i) { if (typeof Symbol === \"undefined\" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i[\"return\"] != null) _i[\"return\"](); } finally { if (_d) throw _e; } } return _arr; }\n\nfunction _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }\n\nfunction _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === \"undefined\" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === \"number\") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError(\"Invalid attempt to iterate non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it[\"return\"] != null) it[\"return\"](); } finally { if (didErr) throw err; } } }; }\n\nfunction _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === \"string\") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === \"Object\" && o.constructor) n = o.constructor.name; if (n === \"Map\" || n === \"Set\") return Array.from(o); if (n === \"Arguments\" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }\n\nfunction _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }\n\nfunction _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }\n\n// window.addEventListener(\"load\", () => {\n\n/*\nCoCreateObserver.add({ \n\tname: 'CoCreateFetchInit', // no usage, just to provide for console debugging \n\tobserve: ['subtree', 'childList','attributes'], // the same parameters of options in #https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver/observe\n\tattributes: ['data-fetch_collection'], // it doesn't count added nodes or remove nodes\n\tinclude: \".classname\", // a selector to select only elements that matches\n\texclude: \".classname\", // a selector to exclude elements from processing\n\ttask: function(mutation) { // a function which gets a mutation object according to #https://developer.mozilla.org/en-US/docs/Web/API/MutationRecord\n\t\tCoCreateFetch.initElement(mutation.target)\n\t}\n})\n*/\n\n/**\n * description\n * \n * @param {String} [name] - an optional name to provide for debugging console\n * @param {Array} observe - a list of mutation type to be observerd, a mix of possible `attributes`, `childList` or `subtree`\n * ... and other params can be here \n * \n * @return null\n */\nwindow.counter = 0;\nwindow.counter2 = 0;\n\nif (!Element.prototype.matches) {\n  Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {\n    var matches = (this.document || this.ownerDocument).querySelectorAll(s),\n        i = matches.length;\n\n    while (--i >= 0 && matches.item(i) !== this) {}\n\n    return i > -1;\n  };\n}\n\nvar CoCreateObserver = {\n  initTasks: new Map(),\n  attrTasks: new Map(),\n  rules: new Map(),\n  rulesArray: [],\n  __init: function __init() {\n    var self = this;\n    var observer = new MutationObserver(function (mutationsList, observer) {\n      return self.__callback(mutationsList, observer);\n    }); // setTimeout(()=>{\n\n    observer.observe(document.body, _defineProperty({\n      attributes: true,\n      childList: true,\n      subtree: true,\n      characterData: false,\n      attributeOldValue: true\n    }, \"characterData\", true));\n  },\n  init: function init(data) {\n    this.add(data);\n  },\n  add: function add(_ref) {\n    var observe = _ref.observe,\n        include = _ref.include,\n        exclude = _ref.exclude,\n        attributes = _ref.attributes,\n        name = _ref.name,\n        task = _ref.task;\n\n    if (observe.some(function (x) {\n      return x == \"childList\";\n    })) {\n      this.initTasks.set(task, {\n        observe: observe,\n        include: include,\n        exclude: exclude,\n        attributes: attributes,\n        name: name\n      });\n    }\n\n    if (observe.some(function (x) {\n      return x == \"attributes\";\n    })) {\n      this.attrTasks.set(task, {\n        observe: observe,\n        include: include,\n        exclude: exclude,\n        attributes: attributes,\n        name: name\n      });\n    }\n  },\n  remove: function remove(_ref2) {\n    var include = _ref2.include,\n        exclude = _ref2.exclude,\n        name = _ref2.name;\n    this.rules.set(name, {\n      include: include,\n      exclude: exclude\n    });\n    this.rulesArray = Array.from(this.rules);\n  },\n  addRule: function addRule(_ref3) {\n    var include = _ref3.include,\n        exclude = _ref3.exclude,\n        name = _ref3.name;\n    this.rules.set(name, {\n      include: include,\n      exclude: exclude\n    });\n    this.rulesArray = Array.from(this.rules);\n  },\n  removeRule: function removeRule(_ref4) {\n    var name = _ref4.name;\n    this.rules[\"delete\"](name);\n    this.rulesArray = Array.from(this.rules);\n  },\n  __callback: function __callback(mutationsList, observer) {\n    // console.log(this)\n    var _iterator = _createForOfIteratorHelper(mutationsList),\n        _step;\n\n    try {\n      for (_iterator.s(); !(_step = _iterator.n()).done;) {\n        var mutation = _step.value;\n\n        if (mutation.type == \"childList\" && mutation.addedNodes.length > 0) {\n          //. run init functions\n          this.__initCallback(mutation);\n        }\n\n        if (mutation.type == \"attributes\") {\n          //. run attributes functions\n          this.__attrCallback(mutation);\n        }\n      }\n    } catch (err) {\n      _iterator.e(err);\n    } finally {\n      _iterator.f();\n    }\n  },\n  __initCallback: function __initCallback(mutation) {\n    var addedNodes = Array.from(mutation.addedNodes);\n    this.initTasks.forEach(function (_ref5, callbackFunc) {\n      var observe = _ref5.observe,\n          include = _ref5.include,\n          exclude = _ref5.exclude,\n          attributes = _ref5.attributes,\n          name = _ref5.name;\n      mutation.addedNodes.forEach(function (el) {\n        if (!el.tagName) return;\n\n        if (include && !(el.matches(include) || el.querySelector(include))) {\n          return;\n        }\n\n        if (exclude && (el.matches(exclude) || el.querySelector(exclude))) {\n          return;\n        }\n\n        if (el.created) return;\n        callbackFunc.apply(null, [{\n          target: el\n        }]);\n      });\n    });\n    addedNodes.map(function (el) {\n      return el.created = true;\n    });\n  },\n  __attrCallback: function __attrCallback(mutation) {\n    var _iterator2 = _createForOfIteratorHelper(this.rulesArray),\n        _step2;\n\n    try {\n      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {\n        var _step2$value = _slicedToArray(_step2.value, 2),\n            name = _step2$value[0],\n            _step2$value$ = _step2$value[1],\n            include = _step2$value$.include,\n            exclude = _step2$value$.exclude;\n\n        if (include && !mutation.target.matches(include)) return;\n        if (exclude && mutation.target.matches(exclude)) return;\n      }\n    } catch (err) {\n      _iterator2.e(err);\n    } finally {\n      _iterator2.f();\n    }\n\n    this.attrTasks.forEach(function (_ref6, callbackFunc) {\n      var observe = _ref6.observe,\n          include = _ref6.include,\n          exclude = _ref6.exclude,\n          attributes = _ref6.attributes,\n          name = _ref6.name;\n\n      if (attributes && mutation.attributeName && !attributes.includes(mutation.attributeName)) {\n        return;\n      }\n\n      if (include && !mutation.target.matches(include)) return;\n      if (exclude && mutation.target.matches(exclude)) return;\n\n      if (mutation.attributeName) {\n        var newValue = mutation.target.getAttribute(mutation.attributeName);\n\n        if (newValue != mutation.oldValue) {\n          callbackFunc.apply(null, [mutation]);\n        }\n      }\n    });\n  },\n  setInitialized: function setInitialized(element, type) {\n    // element.setAttribute(`initialized_${type}`, \"true\");\n    type = type || \"\";\n    var key = \"co_initialized_\" + type;\n    element[key] = true;\n  },\n  getInitialized: function getInitialized(element, type) {\n    type = type || \"\";\n    var key = \"co_initialized_\" + type;\n\n    if (!element[key]) {\n      return false;\n    } else {\n      return true;\n    }\n  }\n};\n\nCoCreateObserver.__init();\n\nwindow.CoCreateObserver = CoCreateObserver;\n/* harmony default export */ __webpack_exports__[\"default\"] = (CoCreateObserver);//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9Db0NyZWF0ZU9ic2VydmVyLy4vc3JjL0NvQ3JlYXRlLW9ic2VydmVyLmpzP2U3MTEiXSwibmFtZXMiOlsid2luZG93IiwiY291bnRlciIsImNvdW50ZXIyIiwiRWxlbWVudCIsInByb3RvdHlwZSIsIm1hdGNoZXMiLCJtYXRjaGVzU2VsZWN0b3IiLCJtb3pNYXRjaGVzU2VsZWN0b3IiLCJtc01hdGNoZXNTZWxlY3RvciIsIm9NYXRjaGVzU2VsZWN0b3IiLCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3IiLCJzIiwiZG9jdW1lbnQiLCJvd25lckRvY3VtZW50IiwicXVlcnlTZWxlY3RvckFsbCIsImkiLCJsZW5ndGgiLCJpdGVtIiwiQ29DcmVhdGVPYnNlcnZlciIsImluaXRUYXNrcyIsIk1hcCIsImF0dHJUYXNrcyIsInJ1bGVzIiwicnVsZXNBcnJheSIsIl9faW5pdCIsInNlbGYiLCJvYnNlcnZlciIsIk11dGF0aW9uT2JzZXJ2ZXIiLCJtdXRhdGlvbnNMaXN0IiwiX19jYWxsYmFjayIsIm9ic2VydmUiLCJib2R5IiwiYXR0cmlidXRlcyIsImNoaWxkTGlzdCIsInN1YnRyZWUiLCJjaGFyYWN0ZXJEYXRhIiwiYXR0cmlidXRlT2xkVmFsdWUiLCJpbml0IiwiZGF0YSIsImFkZCIsImluY2x1ZGUiLCJleGNsdWRlIiwibmFtZSIsInRhc2siLCJzb21lIiwieCIsInNldCIsInJlbW92ZSIsIkFycmF5IiwiZnJvbSIsImFkZFJ1bGUiLCJyZW1vdmVSdWxlIiwibXV0YXRpb24iLCJ0eXBlIiwiYWRkZWROb2RlcyIsIl9faW5pdENhbGxiYWNrIiwiX19hdHRyQ2FsbGJhY2siLCJmb3JFYWNoIiwiY2FsbGJhY2tGdW5jIiwiZWwiLCJ0YWdOYW1lIiwicXVlcnlTZWxlY3RvciIsImNyZWF0ZWQiLCJhcHBseSIsInRhcmdldCIsIm1hcCIsImF0dHJpYnV0ZU5hbWUiLCJpbmNsdWRlcyIsIm5ld1ZhbHVlIiwiZ2V0QXR0cmlidXRlIiwib2xkVmFsdWUiLCJz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QUFDQSxRQUFJb0IsR0FBRyxHQUFHLG9CQUFvQnBCLElBQTlCO0FBQ0FtQixXQUFPLENBQUNDLEdBQUQsQ0FBUCxHQUFlLElBQWY7QUFDQSxHQXJIdUI7QUF1SHhCQyxnQkFBYyxFQUFFLHdCQUFTRixPQUFULEVBQWtCbkIsSUFBbEIsRUFBd0I7QUFDdkNBLFFBQUksR0FBR0EsSUFBSSxJQUFJLEVBQWY7QUFDQSxRQUFJb0IsR0FBRyxHQUFHLG9CQUFvQnBCLElBQTlCOztBQUNBLFFBQUksQ0FBQ21CLE9BQU8sQ0FBQ0MsR0FBRCxDQUFaLEVBQW1CO0FBQ2xCLGFBQU8sS0FBUDtBQUNBLEtBRkQsTUFFTztBQUNOLGFBQU8sSUFBUDtBQUNBO0FBQ0Q7QUEvSHVCLENBQXpCOztBQWtJQXZELGdCQUFnQixDQUFDTSxNQUFqQjs7QUFFQXhCLE1BQU0sQ0FBQ2tCLGdCQUFQLEdBQTBCQSxnQkFBMUI7QUFFZUEsK0VBQWYiLCJmaWxlIjoiLi9zcmMvQ29DcmVhdGUtb2JzZXJ2ZXIuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIiwgKCkgPT4ge1xuXG4vKlxuQ29DcmVhdGVPYnNlcnZlci5hZGQoeyBcblx0bmFtZTogJ0NvQ3JlYXRlRmV0Y2hJbml0JywgLy8gbm8gdXNhZ2UsIGp1c3QgdG8gcHJvdmlkZSBmb3IgY29uc29sZSBkZWJ1Z2dpbmcgXG5cdG9ic2VydmU6IFsnc3VidHJlZScsICdjaGlsZExpc3QnLCdhdHRyaWJ1dGVzJ10sIC8vIHRoZSBzYW1lIHBhcmFtZXRlcnMgb2Ygb3B0aW9ucyBpbiAjaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL011dGF0aW9uT2JzZXJ2ZXIvb2JzZXJ2ZVxuXHRhdHRyaWJ1dGVzOiBbJ2RhdGEtZmV0Y2hfY29sbGVjdGlvbiddLCAvLyBpdCBkb2Vzbid0IGNvdW50IGFkZGVkIG5vZGVzIG9yIHJlbW92ZSBub2Rlc1xuXHRpbmNsdWRlOiBcIi5jbGFzc25hbWVcIiwgLy8gYSBzZWxlY3RvciB0byBzZWxlY3Qgb25seSBlbGVtZW50cyB0aGF0IG1hdGNoZXNcblx0ZXhjbHVkZTogXCIuY2xhc3NuYW1lXCIsIC8vIGEgc2VsZWN0b3IgdG8gZXhjbHVkZSBlbGVtZW50cyBmcm9tIHByb2Nlc3Npbmdcblx0dGFzazogZnVuY3Rpb24obXV0YXRpb24pIHsgLy8gYSBmdW5jdGlvbiB3aGljaCBnZXRzIGEgbXV0YXRpb24gb2JqZWN0IGFjY29yZGluZyB0byAjaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL011dGF0aW9uUmVjb3JkXG5cdFx0Q29DcmVhdGVGZXRjaC5pbml0RWxlbWVudChtdXRhdGlvbi50YXJnZXQpXG5cdH1cbn0pXG4qL1xuXG5cbi8qKlxuICogZGVzY3JpcHRpb25cbiAqIFxuICogQHBhcmFtIHtTdHJpbmd9IFtuYW1lXSAtIGFuIG9wdGlvbmFsIG5hbWUgdG8gcHJvdmlkZSBmb3IgZGVidWdnaW5nIGNvbnNvbGVcbiAqIEBwYXJhbSB7QXJyYXl9IG9ic2VydmUgLSBhIGxpc3Qgb2YgbXV0YXRpb24gdHlwZSB0byBiZSBvYnNlcnZlcmQsIGEgbWl4IG9mIHBvc3NpYmxlIGBhdHRyaWJ1dGVzYCwgYGNoaWxkTGlzdGAgb3IgYHN1YnRyZWVgXG4gKiAuLi4gYW5kIG90aGVyIHBhcmFtcyBjYW4gYmUgaGVyZSBcbiAqIFxuICogQHJldHVybiBudWxsXG4gKi9cblxud2luZG93LmNvdW50ZXIgPSAwO1xud2luZG93LmNvdW50ZXIyID0gMDtcbmlmICghRWxlbWVudC5wcm90b3R5cGUubWF0Y2hlcykge1xuICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzID1cbiAgICBFbGVtZW50LnByb3RvdHlwZS5tYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tb3pNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFbGVtZW50LnByb3RvdHlwZS5tc01hdGNoZXNTZWxlY3RvciB8fFxuICAgIEVsZW1lbnQucHJvdG90eXBlLm9NYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBFbGVtZW50LnByb3RvdHlwZS53ZWJraXRNYXRjaGVzU2VsZWN0b3IgfHxcbiAgICBmdW5jdGlvbihzKSB7XG4gICAgICB2YXIgbWF0Y2hlcyA9ICh0aGlzLmRvY3VtZW50IHx8IHRoaXMub3duZXJEb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChzKSxcbiAgICAgICAgaSA9IG1hdGNoZXMubGVuZ3RoO1xuICAgICAgd2hpbGUgKC0taSA+PSAwICYmIG1hdGNoZXMuaXRlbShpKSAhPT0gdGhpcykge31cbiAgICAgIHJldHVybiBpID4gLTE7XG4gICAgfTtcbn1cblxuY29uc3QgQ29DcmVhdGVPYnNlcnZlciA9IHtcbiAgaW5pdFRhc2tzOiBuZXcgTWFwKCksXG4gIGF0dHJUYXNrczogbmV3IE1hcCgpLFxuICBydWxlczogbmV3IE1hcCgpLFxuICBydWxlc0FycmF5OiBbXSxcblxuICBfX2luaXQ6IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xuICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9uc0xpc3QsIG9ic2VydmVyKSA9PiBzZWxmLl9fY2FsbGJhY2sobXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpKTtcbiAgICBcbiAgICAvLyBzZXRUaW1lb3V0KCgpPT57XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCBcbiAgICAgIHtcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBzdWJ0cmVlOiB0cnVlLFxuICAgICAgICBjaGFyYWN0ZXJEYXRhOiBmYWxzZSxcbiAgICAgICAgYXR0cmlidXRlT2xkVmFsdWU6IHRydWUsXG4gICAgICAgIGNoYXJhY3RlckRhdGE6IHRydWUsXG4gICAgICB9XG4gICAgKTtcbiAgfSxcbiAgXG4gIGluaXQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB0aGlzLmFkZChkYXRhKTtcbiAgfSxcbiAgXG4gIGFkZDogZnVuY3Rpb24oeyBvYnNlcnZlLCBpbmNsdWRlLCBleGNsdWRlLCBhdHRyaWJ1dGVzLCBuYW1lLCB0YXNrIH0pIHtcbiAgICBpZiAob2JzZXJ2ZS5zb21lKHggPT4geCA9PSBcImNoaWxkTGlzdFwiKSkge1xuICAgICAgdGhpcy5pbml0VGFza3Muc2V0KHRhc2ssIHsgb2JzZXJ2ZSwgaW5jbHVkZSwgZXhjbHVkZSwgYXR0cmlidXRlcywgbmFtZSB9KTtcbiAgICB9XG4gICAgXG4gICAgaWYgKG9ic2VydmUuc29tZSh4ID0+ICB4ID09IFwiYXR0cmlidXRlc1wiKSkge1xuICAgICAgdGhpcy5hdHRyVGFza3Muc2V0KHRhc2ssIHsgb2JzZXJ2ZSwgaW5jbHVkZSwgZXhjbHVkZSwgYXR0cmlidXRlcywgbmFtZSB9KTtcbiAgICB9XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24oeyBpbmNsdWRlLCBleGNsdWRlLCBuYW1lIH0pIHtcbiAgICB0aGlzLnJ1bGVzLnNldChuYW1lLCB7aW5jbHVkZSwgZXhjbHVkZX0pO1xuICAgIHRoaXMucnVsZXNBcnJheSA9IEFycmF5LmZyb20odGhpcy5ydWxlcyk7XG4gIH0sXG4gIFxuICBhZGRSdWxlOiBmdW5jdGlvbih7IGluY2x1ZGUsIGV4Y2x1ZGUsIG5hbWUgfSkge1xuICAgIHRoaXMucnVsZXMuc2V0KG5hbWUsIHtpbmNsdWRlLCBleGNsdWRlfSk7XG4gICAgdGhpcy5ydWxlc0FycmF5ID0gQXJyYXkuZnJvbSh0aGlzLnJ1bGVzKTtcbiAgfSxcbiAgXG4gIHJlbW92ZVJ1bGU6IGZ1bmN0aW9uICh7bmFtZX0pIHtcbiAgICB0aGlzLnJ1bGVzLmRlbGV0ZShuYW1lKTtcbiAgICB0aGlzLnJ1bGVzQXJyYXkgPSBBcnJheS5mcm9tKHRoaXMucnVsZXMpO1xuICB9LFxuICBcbiAgX19jYWxsYmFjazogZnVuY3Rpb24obXV0YXRpb25zTGlzdCwgb2JzZXJ2ZXIpIHtcbiAgICAvLyBjb25zb2xlLmxvZyh0aGlzKVxuICAgIGZvciAobGV0IG11dGF0aW9uIG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgIGlmIChtdXRhdGlvbi50eXBlID09IFwiY2hpbGRMaXN0XCIgJiYgbXV0YXRpb24uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgIC8vLiBydW4gaW5pdCBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5fX2luaXRDYWxsYmFjayhtdXRhdGlvbikgICAgXG4gICAgICB9XG4gICAgICBcbiAgICAgIGlmIChtdXRhdGlvbi50eXBlID09IFwiYXR0cmlidXRlc1wiKSB7XG4gICAgICAgIC8vLiBydW4gYXR0cmlidXRlcyBmdW5jdGlvbnNcbiAgICAgICAgdGhpcy5fX2F0dHJDYWxsYmFjayhtdXRhdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBcbiAgX19pbml0Q2FsbGJhY2s6IGZ1bmN0aW9uKG11dGF0aW9uKSB7XG4gICAgbGV0IGFkZGVkTm9kZXMgPSBBcnJheS5mcm9tKG11dGF0aW9uLmFkZGVkTm9kZXMpO1xuICAgIFxuICAgIHRoaXMuaW5pdFRhc2tzLmZvckVhY2goKHtvYnNlcnZlLCBpbmNsdWRlLCBleGNsdWRlLCBhdHRyaWJ1dGVzLCBuYW1lfSwgY2FsbGJhY2tGdW5jKSA9PiB7XG5cbiAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgoZWwpID0+IHtcbiAgICAgICAgaWYgKCFlbC50YWdOYW1lKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBpZiAoaW5jbHVkZSAmJiAhKGVsLm1hdGNoZXMoaW5jbHVkZSkgfHwgZWwucXVlcnlTZWxlY3RvcihpbmNsdWRlKSkpIHtcbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgfSBcbiAgICAgICAgaWYgKGV4Y2x1ZGUgJiYgKGVsLm1hdGNoZXMoZXhjbHVkZSkgfHwgZWwucXVlcnlTZWxlY3RvcihleGNsdWRlKSkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChlbC5jcmVhdGVkKSByZXR1cm47XG4gICAgICAgIFxuICAgICAgICBjYWxsYmFja0Z1bmMuYXBwbHkobnVsbCwgW3t0YXJnZXQ6IGVsfV0pO1xuICAgICAgfSlcbiAgICB9KTtcbiAgICBcbiAgICBhZGRlZE5vZGVzLm1hcChlbCA9PiBlbC5jcmVhdGVkID0gdHJ1ZSk7XG4gIH0sXG4gIFxuICBfX2F0dHJDYWxsYmFjazogZnVuY3Rpb24obXV0YXRpb24pIHtcbiAgICBmb3IgKGxldCBbbmFtZSwgeyBpbmNsdWRlLCBleGNsdWRlIH1dIG9mIHRoaXMucnVsZXNBcnJheSkge1xuICAgICAgaWYgKGluY2x1ZGUgJiYgIW11dGF0aW9uLnRhcmdldC5tYXRjaGVzKGluY2x1ZGUpKSByZXR1cm47XG4gICAgICBpZiAoZXhjbHVkZSAmJiBtdXRhdGlvbi50YXJnZXQubWF0Y2hlcyhleGNsdWRlKSkgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmF0dHJUYXNrcy5mb3JFYWNoKCh7b2JzZXJ2ZSwgaW5jbHVkZSwgZXhjbHVkZSwgYXR0cmlidXRlcywgbmFtZX0sIGNhbGxiYWNrRnVuYykgPT4ge1xuICAgICAgaWYgKGF0dHJpYnV0ZXMgJiYgbXV0YXRpb24uYXR0cmlidXRlTmFtZSAmJiAhYXR0cmlidXRlcy5pbmNsdWRlcyhtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAoaW5jbHVkZSAmJiAhbXV0YXRpb24udGFyZ2V0Lm1hdGNoZXMoaW5jbHVkZSkpIHJldHVybjtcbiAgICAgIGlmIChleGNsdWRlICYmIG11dGF0aW9uLnRhcmdldC5tYXRjaGVzKGV4Y2x1ZGUpKSByZXR1cm47XG5cbiAgICAgIGlmIChtdXRhdGlvbi5hdHRyaWJ1dGVOYW1lKSB7XG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IG11dGF0aW9uLnRhcmdldC5nZXRBdHRyaWJ1dGUobXV0YXRpb24uYXR0cmlidXRlTmFtZSk7XG4gICAgICAgIGlmIChuZXdWYWx1ZSAhPSBtdXRhdGlvbi5vbGRWYWx1ZSkge1xuICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShudWxsLCBbbXV0YXRpb25dKTtcbiAgICAgICAgfVxuICAgICAgfSAgICAgIFxuICAgICAgXG4gICAgfSlcbiAgfSxcbiAgXG4gIHNldEluaXRpYWxpemVkOiBmdW5jdGlvbihlbGVtZW50LCB0eXBlKSB7XG5cdFx0Ly8gZWxlbWVudC5zZXRBdHRyaWJ1dGUoYGluaXRpYWxpemVkXyR7dHlwZX1gLCBcInRydWVcIik7XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJcIjtcblx0XHRsZXQga2V5ID0gXCJjb19pbml0aWFsaXplZF9cIiArIHR5cGU7XG5cdFx0ZWxlbWVudFtrZXldID0gdHJ1ZTtcblx0fSxcblx0XG5cdGdldEluaXRpYWxpemVkOiBmdW5jdGlvbihlbGVtZW50LCB0eXBlKSB7XG5cdFx0dHlwZSA9IHR5cGUgfHwgXCJcIjtcblx0XHRsZXQga2V5ID0gXCJjb19pbml0aWFsaXplZF9cIiArIHR5cGU7XG5cdFx0aWYgKCFlbGVtZW50W2tleV0pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fVxuXHR9XG59XG5cbkNvQ3JlYXRlT2JzZXJ2ZXIuX19pbml0KCk7XG5cbndpbmRvdy5Db0NyZWF0ZU9ic2VydmVyID0gQ29DcmVhdGVPYnNlcnZlcjtcblxuZXhwb3J0IGRlZmF1bHQgQ29DcmVhdGVPYnNlcnZlcjsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./src/CoCreate-observer.js\n");

/***/ })

/******/ })["default"];
});