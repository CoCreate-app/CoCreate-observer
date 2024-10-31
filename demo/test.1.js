import observer from "../src/index";

// observer.init({
//     name: 'Test Attribute',
//     observe: ['attributes'],
//     // attributeFilter:['ba'],
//     callback: function(mutation) {
//         console.log('anhy attribute observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['attributes'],
//     attributeFilter: ['ba'],
//     callback: function(mutation) {
//         console.log('ba observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['attributes'],
//   selector: 'div.el',
//     callback: function(mutation) {
//         console.log('div.el observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['attributes'],
//     attributeFilter: ['ba'],
//   selector: 'div.el',
//     callback: function(mutation) {
//         console.log('div.el with attribute ba observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['characterData'],
//     callback: function(mutation) {
//         console.log('characterData observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['characterData'],
//   selector: 'div.el',
//     callback: function(mutation) {
//         console.log('characterDat with div.el observed', mutation)
//     },
// })

// observer.init({
//   name: "Test Attribute",
//   observe: ["childList"],
//   callback: function (mutation) {
//     console.log("childList observed", mutation);
//   },
// });

// observer.init({
//   name: "Test Attribute",
//   observe: ["childList"],
// selector: "div.el",
//   callback: function (mutation) {
//     console.log("childList div.el observed", mutation);
//   },
// });

observer.init({
    name: "Test Attribute",
    observe: ["addedNodes"],
    callback: function (mutation) {
        console.log("addedNodes observed", mutation);
    },
});

observer.init({
    name: "Test Attribute",
    observe: ["addedNodes"],
    selector: "div.el",
    callback: function (mutation) {
        console.log("addedNodes  div.el observed", mutation);
    },
});

observer.init({
    name: "Test Attribute",
    observe: ["removedNodes"],
    callback: function (mutation) {
        console.log("removedNodes observed", mutation);
    },
});

observer.init({
    name: "Test Attribute",
    observe: ["removedNodes"],
    selector: "div.el",
    callback: function (mutation) {
        console.log("removedNodes div.el observed", mutation);
    },
});
