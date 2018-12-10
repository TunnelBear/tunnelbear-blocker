(function () {

'use strict';

if (document instanceof HTMLDocument === false) {
  //console.debug('contentscript-end.js > not a HTLMDocument');
  return false;
}

if (!vAPI) {
  //console.debug('contentscript-end.js > vAPI not found');
  return;
}

var messager = vAPI.messaging;
messager.addChannelListener('blockbear-contentscript-end.js');
window.addEventListener('message', function (event) {
  if (event && event.data && event.data.source == 'blockbear-pixel-tracking') {
    messager.send('blockbear-contentscript-end.js', { what: 'pixel-tracking' });
  }
});

(function () {
  var getResultFromXPath = function (iterator) {
    var result = [];
    try {
      var node = iterator.iterateNext();
      while (node) {
        result.push(node);
        node = iterator.iterateNext();
      }
    }
    catch (e) {
      console.log(e);
    }
    return result;
  }
  var getFlashElements = function (xpath, node) {
    if (!xpath) {
      xpath = "//object[contains(@type, 'x-shockwave-flash') and not(@classid)] | //object[contains(@type,'futuresplash') and not(@classid)] | //embed[contains(@type,'x-shockwave-flash')] | //embed[contains(@type,'futuresplash')]";
    }
    if (!node) {
      node = document.body;
    }
    var iterator = document.evaluate(xpath, node, null, XPathResult.ANY_TYPE, null);
    var list = getResultFromXPath(iterator);
    return list;
  }
  var getFlashContainerToBlock = function () {
    var result = [];
    getFlashElements().forEach(function (element) {
      var computedStyle = window.getComputedStyle(element);
      if (element.style.display != 'none'
        && computedStyle.display != 'none'
        && !element.classList.contains("tb-unlock")) {
        element.style.display = 'none';
      }
      var iterator = document.evaluate("parent::*[not(contains(@class, 'tb-container'))]", element, null, XPathResult.ANY_TYPE, null);
      var container = getResultFromXPath(iterator)[0];
      if (container) {
        result.push(container);
      }
    }, this);
    return result;
  }
  var getBlockStyle = function (node) {
    var result = getFlashElements("embed | object", node)
    var style = window.getComputedStyle(result[0]);
    return {
      background: getBlockBackground(),
      width: style.width,
      height: style.height,
      top: style.top,
      left: style.left,
      position: 'absolute'
    }
  }
  var getBlockBackground = function (hover) {
    var img = 'img/flash_blocked';
    if (hover) {
      img = 'img/flash_unblock';
    }
    var suffix = ".png";
    if (window.devicePixelRatio > 1) {
      suffix = "2x.png";
    }
    return "url(" + chrome.extension.getURL(img + suffix) + ") 50% 50% no-repeat black";
  }

  var blockFlash = function () {
    var containers = getFlashContainerToBlock();
    containers.forEach(function (element) {
      blockFlashElement(element);
    }, this);
  }

  var blockFlashElement = function (element) {
    element.classList.add('tb-container');
    var btn = document.createElement("div");
    btn.classList.add("tb-block");
    var style = getBlockStyle(element);
    for (var key in style) {
      btn.style[key] = style[key];
    }
    btn.addEventListener("click", function (event) {
      var items = getFlashElements("embed | object", element);
      items.forEach(function (item) {
        unblockFlashElement(item);
      }, this);
      btn.style.display = "none";
    });
    btn.addEventListener("mouseover", function (event) {
      btn.style["background"] = getBlockBackground(true);
    });
    btn.addEventListener("mouseout", function (event) {
      btn.style["background"] = getBlockBackground();
    });
    element.appendChild(btn);
    // Delay sending message because of count synchronization issues
    // see https://tbears.atlassian.net/browse/TB-12402
    setTimeout(function () {
      messager.send('blockbear-contentscript-end.js', { what: 'incrementFlashCount' });
    }, 1000);
  }

  var unblockFlash = function () {
    var elements = getFlashElements();
    elements.forEach(function (element) {
      unblockFlashElement(element);
    }, this);
  }

  var unblockFlashElement = function (element) {
    element.classList.add("tb-unlock");
    element.style.display = "";
    messager.send('blockbear-contentscript-end.js', { what: 'decrementFlashCount' });
  }

  var applyFlashbear = function () {
    messager.send('blockbear-contentscript-end.js', {
      what: 'blockFlash'
    }, function (response) {
      if (response && response.result) {
        blockFlash();
      } else {
        unblockFlash();
      }
    });
  }
  if (document.body) {
    new MutationObserver(function (mutations) {
      applyFlashbear();
    }).observe(document.body, { childList: true, subtree: true });
    applyFlashbear();
  }
})();

messager.send('blockbear-contentscript-end.js', {
  what: 'blockEmailEnabled'
}, function (response) {
  if (response) {
    var sm = document.createElement('script');
    sm.src = chrome.extension.getURL('js/blockbear-pixel-tracking.js');
    document.getElementsByTagName('body')[0].appendChild(sm);
  }
});

})();
