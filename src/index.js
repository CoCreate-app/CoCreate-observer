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
      this.callbackMap.set('ALL', { attributes: [], addedNodes: [], removedNodes: [], characterData: [] })

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





    observer.prototype.init = function init({ observe = ['addedNodes', 'attributes', 'characterData'], attributesFilter: attributes, callback }) {
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
      window.counter++;
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
      
      if (mutation.target.data === mutation.oldValue)
        return;
      
      
      this.runCallbackCharAll(mutation)
      
      // a text node garaunteed to have a parentElement
      let parent = mutation.target.parentElement;
      for (let attribute of parent.attributes) {
        this.runCallbackChar(mutation, attribute.name)
      }
      
    }

    observer.prototype._childListCallback = function _childListCallback(mutation) {

      this.runCallbackAdd(mutation)
      this.runCallbackRemove(mutation)

    }


 
    export default new observer(document.body);
    