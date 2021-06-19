function observer(doc) {

  this.callbackMap = new Map();
  this.callbackMap.set('ALL', [])
  this.taskCallbackMap = new Map();
  this.taskCallbackMap.set('characterData', [])
  this.taskCallbackMap.set('childList', [])


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





observer.prototype.init = function init({ observe = ['childList', 'attributes'], attributeFilter: attributes, callback }) {
  this.observe = observe;
  this.callback = callback;
  for (let observeType of observe) {
    switch (observeType) {
      case 'attributes':
        if (attributes && attributes.length)
          for (let attr of attributes)
            this._register(this.callbackMap, attr.toLowerCase())
        else
          this._register(this.callbackMap, 'ALL')
        break;

      case 'childList':
      case 'characterData':


        this._register(this.taskCallbackMap, observeType)
        break
      default:

        throw new Error('observe type not recongnized')
    }

  }




}

observer.prototype._register = function _register(map, key) {
  for (let observeType of this.observe) {
    if (map.has(key))
      map.get(key).push(this.callback);
    else
      map.set(key, [this.callback])

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


  let callbacks = this.callbackMap.get(mutation.attributeName);
  if (callbacks && callbacks['attributes'])
    for (let callback of callbacks['attributes'])
      callback(mutation)




}



observer.prototype._characterDataCallback = function _characterDataCallback(mutation) {

  if (mutation.target.value === mutation.oldValue)
    return;

  this.taskCallbackMap.get('characterData')
    .forEach(callback => callback(mutation))


}

observer.prototype._childListCallback = function _childListCallback(mutation) {

  this.taskCallbackMap.get('childList')
    .forEach(callback => callback(mutation))

}


let o = new observer(document.body);
window.CoCreate = { observer: o }
// o.init({
//   observe: ['attributes', 'childList', 'characterData'],
//   // attributes: ['bb'],
//   callback: (mutation) => {
//     console.log(mutation)
//   }
// })
// export default observer
