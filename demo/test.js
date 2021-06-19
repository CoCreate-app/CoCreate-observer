function observer(doc) {

  this.attrCallback = new Map();
  this.attrCallback.set('ALL', [])

  this.removeCallback = new Map();
  this.removeCallback.set('ALL', [])

  this.addCallback = new Map();
  this.addCallback.set('ALL', [])

  this.charDataCallback = new Map();
  this.charDataCallback.set('ALL', [])

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






observer.prototype.init = function init({ observe = ['addElement', 'attributes'], attributes, callback }) {
  this.observe = observe;
  this.attributes = attributes;
  this.callback = callback;

  if (attributes && attributes.length)
    for (let attr of attributes)
      this._register(attr.toLowerCase())
  else
    this._register('ALL')

}
observer.prototype._spread = function _spread(map, attr) {
  if (map.has(attr))
    map.get(attr).push(this.callback);
  else
    map.set(attr, [this.callback])
}
observer.prototype._register = function _register(attr) {
  for (let observeType of this.observe) {
    switch (observeType) {
      case 'addElement':
        this._spread(this.addCallback, attr)
        break;
      case 'removeElement':
        this._spread(this.removeCallback, attr)

        break;
      case 'attributes':
        this._spread(this.attrCallback, attr)

        break;
      case 'characterData':
        this._spread(this.charDataCallback, attr)

        break;
      default:
        throw new Error('observe type not recongnized')
    }


  }
}


observer.prototype.uninit = function uninit({ callback }) {

}

observer.prototype._callback = function _callback(mutationsList) {
  for (let mutation of mutationsList) {
    switch (mutation.type) {
      case 'attributes':
        this._attributeCallback(mutation)
        break;
      case 'characterData':
        break;
        this._characterDataCallback(mutation)

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

  if (this.attrCallback.has(mutation.attributeName))
    for (let callback of this.attrCallback.get(mutation.attributeName))
      callback(mutation)


  for (let callback of this.attrCallback.get('ALL'))
    callback(mutation)
}

observer.prototype._characterDataCallback = function _characterDataCallback(mutation) {

  if (!mutation.target.parentElement.hasAttributes(mutation.attributeName)) return;

  if (mutation.target.value === mutation.oldValue)
    return;


  if (this.charDataCallback.has(mutation.attributeName))
    for (let callback of this.charDataCallback.get(mutation.attributeName))
      callback(mutation)


  for (let callback of this.charDataCallback.get('ALL'))
    callback(mutation)

}

observer.prototype._childListCallback = function _childListCallback(mutation) {

  for (let addedNode of mutation.addedNodes)
    for (let attribute of addedNode.attributes || addedNode.parentElement.attributes)
      if (this.addCallback.has(attribute.name))
        for (let callback of this.addCallback.get(attribute.name))
          callback({ type: mutation.type, target: addedNode, addElement: true })

  for (let callback of this.addCallback.get('ALL'))
    for (let addedNode of mutation.addedNodes)
      callback({ type: mutation.type, target: addedNode, addElement: true })


  for (let removeNode of mutation.removedNodes)
    for (let attribute of removeNode.attributes)
      if (this.removeCallback.has(attribute.name))
        for (let callback of this.removeCallback.get(attribute.name))
          callback({ type: mutation.type, target: removeNode, removeElement: true })


  for (let callback of this.addCallback.get('ALL'))
    for (let removeNode of mutation.removedNodes)
      callback({ type: mutation.type, target: removeNode, removeElement: true })
}


let o = new observer(document.body);

o.init({
  observe: ['attributes', 'addElement', 'removeElement', 'characterData'],
  attributes: ['bb'],
  callback: (mutation) => {
    console.log(mutation)
  }
})
// export default observer
