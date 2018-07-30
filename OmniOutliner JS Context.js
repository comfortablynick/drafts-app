// Test change to file
(() => {
  function newOutline(arrayOfTabIndentedStrings) {
    var priorLevel = null
    var priorItem = null
    var counter
    arrayOfTabIndentedStrings.forEach(function(p) {
      // count the leading tab characters
      counter = 0
      str = p
      while (str.indexOf('	') != -1) {
        counter = counter + 1
        str = str.substr(1);
      }
      itemLevel = counter
      // add item based upon level
      if (priorLevel === null) {
        priorItem = rootItem.addChild(null, function(item) {
          item.topic = p
        })
        priorLevel = 0
      } else if (itemLevel === 0) {
        priorItem = rootItem.addChild(null, function(item) {
          item.topic = p
        })
        priorLevel = 0
      } else if (itemLevel === priorLevel) {
        priorItem = priorItem.parent.addChild(null, function(item) {
          item.topic = p.trim()
        })
        priorLevel = priorLevel
      } else if (itemLevel > priorLevel) {
        priorItem = priorItem.addChild(null, function(item) {
          item.topic = p.trim()
        })
        priorLevel = priorItem.level - 1
      } else if (itemLevel < priorLevel) {
        delta = priorLevel - itemLevel
        if (delta === 1) {
          itemParent = priorItem.parent.parent
          priorItem = itemParent.addChild(null, function(item) {
            item.topic = p.trim()
          })
          priorLevel = priorLevel - 2
        } else if (delta === 2) {
          itemParent = priorItem.parent.parent.parent
          priorItem = itemParent.addChild(null, function(item) {
            item.topic = p.trim()
          })
          priorLevel = priorLevel - 3
        } else if (delta === 3) {
          itemParent = priorItem.parent.parent.parent.parent
          priorItem = itemParent.addChild(null, function(item) {
            item.topic = p.trim()
          })
          priorLevel = priorLevel - 4
        }
      }
    })
  };
  const arrayOfTabIndentedStrings = editor.getText().split('\n');
  app.openURL('omnioutliner://localhost/omnijs-run?script=' + encodeURIComponent('(' + newOutline + ')' + '(' + JSON.stringify(arrayOfTabIndentedStrings) + ')'));
})();