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
//     target: 'div.el',
//     callback: function(mutation) {
//         console.log('div.el observed', mutation)
//     },
// })

// observer.init({
//     name: 'Test Attribute',
//     observe: ['attributes'],
//     attributeFilter: ['ba'],
//     target: 'div.el',
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
//     target: 'div.el',
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
//   target: "div.el",
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
  target: "div.el",
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
  target: "div.el",
  callback: function (mutation) {
    console.log("removedNodes div.el observed", mutation);
  },
});
