import { logger } from '@cocreate/utils'
let console = logger('off');

// todo: run for all mutaitonList addedNodes and removed nodes match with this.mapCallback
// we should keep a binary list of attributes to do fast search and avoid a lot of querySelectorAll


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
window.counter = 0;

// todo: check if order of calling callbacks is irrelevant 

function observer(doc) {

    this.callbackMap = new Map();
    this.callbackMap.set('ALL', { attributes: [], addedNodes: [], removedNodes: [], characterData: [], childList: [] })

    let [func1, func2] = this.runCallbackGen('attributes')
    this.runCallbackAtt = func1;
    this.runCallbackAttAll = func2;
    ([func1, func2] = this.runCallbackGen('characterData'));
    this.runCallbackChar = func1;
    this.runCallbackCharAll = func2;
    this.runCallbackAdd = this.runCallbackExGen('addedNodes', 'addedNodes')
    this.runCallbackRemove = this.runCallbackExGen('removedNodes', 'removedNodes')


    const observer = new MutationObserver((mutationsList) => this._callback.call(this, mutationsList));

    observer.observe(doc, {
        subtree: true, // observers all children and children of children
        childList: true, // observes when elements are added and removed
        attributes: true, // observers all children and children of children
        attributeOldValue: true,
        characterData: true, // observes inntext change
        characterDataOldValue: true
    });
}

const validObserve = ['addedNodes', 'removedNodes', 'attributes', 'characterData', 'childList'];
observer.prototype.init = function init({ observe = ['addedNodes', 'attributes'], attributeFilter: attributes, callback }) {
    if (!observe || !observe.every(i => validObserve.includes(i)))
        throw "please enter a valid observe";
    this.observe = observe;
    this.callback = callback;
    if (attributes && attributes.length)
        for (let attr of attributes)
            this._register(attr.toLowerCase())
    else
        this._register('ALL')

}

observer.prototype._register = function _register(attr) {
    for (let observeType of this.observe) {
        if (observeType === 'childList') {
            if (this.callbackMap.get('ALL')['childList'])
                this.callbackMap.get('ALL')['childList'].push(this.callback);
            continue;
        }

        if (this.callbackMap.has(attr))
            if (this.callbackMap.get(attr)[observeType])
                this.callbackMap.get(attr)[observeType].push(this.callback);
            else
                this.callbackMap.get(attr)[observeType] = [this.callback];
        else
            this.callbackMap.set(attr, {
                [observeType]: [this.callback]
            })
    }
}


observer.prototype.uninit = function uninit(callback) {

    for (let [att, cbList] of this.callbackMap.entries()) {
        if (cbList.attributes)
            cbList.attributes = cbList.attributes.filter(cb => cb !== callback)
        if (cbList.characterData)
            cbList.characterData = cbList.characterData.filter(cb => cb !== callback)
        if (cbList.addedNodes)
            cbList.addedNodes = cbList.addedNodes.filter(cb => cb !== callback)
        if (cbList.removedNodes)
            cbList.removedNodes = cbList.removedNodes.filter(cb => cb !== callback)
        if (cbList.childList)
            cbList.childList = cbList.childList.filter(cb => cb !== callback)
        this.callbackMap.set(att, {
            attributes: cbList.attributes,
            characterData: cbList.characterData,
            addedNodes: cbList.addedNodes,
            removedNodes: cbList.removedNodes,
            childList: cbList.childList
        })
    }


}

observer.prototype._callback = function _callback(mutationsList) {

    for (let mutation of mutationsList) {
        window.counter++;
        switch (mutation.type) {
            case 'attributes':
                this._attributeCallback(mutation)
                break;
            case 'characterData':
                this._characterDataCallback(mutation)
                break;

            case 'childList':
                // if (Array.from(mutation.addedNodes).some(node => node.tagName && node.querySelector('[data-fetch_collection]')))
                //   console.log('aaa')
                this._childListCallback(mutation)
                break;
            default:
        }

    }
}



observer.prototype.runCallbackGen = function runCallbackGen(type) {

    return [function(mutation, att) {
            let callbacks = this.callbackMap.get(att);
            if (callbacks && callbacks[type])
                for (let callback of callbacks[type])
                    callback(mutation)



        },
        function(mutation) {
            for (let callback of this.callbackMap.get('ALL')[type])
                callback(mutation)
        }
    ]

}




observer.prototype._attributeCallback = function _attributeCallback(mutation) {


    if (!mutation.target.hasAttributes(mutation.attributeName)) return;
    let newValue = mutation.target.getAttribute(mutation.attributeName)

    if (newValue === mutation.oldValue)
        return;

    this.runCallbackAtt(mutation, mutation.attributeName)
    this.runCallbackAttAll(mutation)
}


observer.prototype._characterDataCallback = function _characterDataCallback(mutation) {

    if (mutation.target.data === mutation.oldValue)
        return;


    this.runCallbackCharAll(mutation)

    // a text node garaunteed to have a parentElement
    let parent = mutation.target.parentElement;
    for (let attribute of parent.attributes) {
        this.runCallbackChar(mutation, attribute.name)
    }

}

observer.prototype.runCallbackExGen = function runCallbackExGen(type, key) {

    return function runCallbackEx(mutation) {


        for (let node of mutation[key]) {
            if (node.tagName)
                for (let attribute of node.attributes) {
                    let callbacks = this.callbackMap.get(attribute.name)

                    if (callbacks && callbacks[type])
                        for (let callback of callbacks[type])
                            callback({ type: mutation.type, target: node, [type]: true })
                }

            if (node.children)
                runCallbackEx.call(this, {
                    [key]: node.children
                })
        }


        for (let callback of this.callbackMap.get('ALL')[type])
            for (let node of mutation[key])
                if (node.tagName)
                    callback({ type: mutation.type, target: node, [type]: true })





    }

}

observer.prototype._childList = function _childList(mutation) {
    let callbacks = this.callbackMap.get('ALL')['childList']
    callbacks.forEach(callback => {
        callback(mutation)
    })
}

observer.prototype._childListCallback = function _childListCallback(mutation) {

    this._childList(mutation)
    this.runCallbackAdd(mutation)
    this.runCallbackRemove(mutation)

}



observer.prototype.setInitialized = function(element, type) {
        // element.setAttribute(`initialized_${type}`, "true");
        type = type || "";
        let key = "co_initialized_" + type;
        element[key] = true;
    },

    observer.prototype.getInitialized = function(element, type) {
        type = type || "";
        let key = "co_initialized_" + type;
        if (!element[key]) {
            return false;
        } else {
            return true;
        }
    }


export default new observer(document.body);