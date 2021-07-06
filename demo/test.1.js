import observer from '../src/index';

observer.init({
    name: 'Test Attribute',
    observe: ['attributes'], // , ‘addedNodes’, ‘removedNodes’,’characterData’,
    // attributeFilter:['ba'],
    callback: function(mutation) {
        console.log('attribute observed', mutation)
    },
})