function observer(doc) {

  this.callbackMap = new Map();
  this.callbackMap.set('ALL', { attributes: [], addElement: [], removeElement: [], characterData: [] })

  [this.runCallbackAtt, this.runCallbackAttAll] = this.runCallbackGen('attributes')
  [this.runCallbackChar, this.runCallbackCharAll] = this.runCallbackGen('characterData')
  this.runCallbackAdd = this.runCallbackExGen('addElement', 'addedNodes')
  this.runCallbackRemove = this.runCallbackExGen('removeElement', 'removedNodes')

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


observer.prototype.runCallbackGen = function runCallbackGen(type) {

  return [function(mutation, att) {
    
      let list = new Map();
      let callbacks = this.callbackMap.get(att);
      if (callbacks && callbacks[type])
        for (let callback of callbacks[type])
        if(list.has(callback))
          list.set(callback,[mutation])
          // callback(mutation)



    },
    function(mutation) {
      for (let callback of this.callbackMap.get('ALL')[type])
        callback(mutation)
    }
  ]

}

observer.prototype.runCallbackExGen = function runCallbackExGen(type, key) {

  return function(mutation) {


    for (let node of mutation[key])
      for (let attribute of node.attributes || node.parentElement.attributes) {
        let callbacks = this.callbackMap.get(attribute.name)

        if (callbacks && callbacks[type])
          for (let callback of callbacks[type])

            callback({ type: mutation.type, target: node, [type]: true })
      }


    for (let callback of this.callbackMap.get('ALL')[type])
      for (let node of mutation[key])
        callback({ type: mutation.type, target: node, [type]: true })



  }

}





observer.prototype.init = function init({ observe = ['addElement', 'attributes'], attributes, callback }) {
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


observer.prototype.uninit = function uninit({ callback }) {
  // search all callback and remove
}

observer.prototype._callback = function _callback(mutationsList) {

  for (let mutation of mutationsList) {

    switch (mutation.type) {
      case 'attributes':
        this._attributeCallback(mutation)
        break;
      case 'characterData':
        this._characterDataCallback(mutation)
        break;

      case 'childList':
        this._childListCallback(mutation)
        break;
      default:
        // code
    }

  }
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

  if (mutation.target.value === mutation.oldValue)
    return;

  let parent = mutation.target.parentElement;
  
  let list = new Map();
  
  for (let attribute of parent.attributes) {
    this.runCallbackChar(mutation, mutation.attributeName)
  }
  this.runCallbackCharAll(mutation)
}

observer.prototype._childListCallback = function _childListCallback(mutation) {

  this.runCallbackAdd(mutation)
  this.runCallbackRemove(mutation)

}


let o = new observer(document.body);

o.init({
  observe: ['attributes', 'addElement', 'removeElement', 'characterData'],
  // attributes: ['bb'],
  callback: (mutation) => {
    console.log(mutation)
  }
})
// export default observer
