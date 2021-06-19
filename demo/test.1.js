  const observer = new MutationObserver((list)=>{
    console.log(list)
  });

  observer.observe(document.body, {
    subtree: true, // observers all children and children of children
    childList: true, // observes when elements are added and removed
    attributes: true, // observers all children and children of children
    attributeOldValue: true,
    characterData: true, // observes inntext change
    characterDataOldValue: true
  });