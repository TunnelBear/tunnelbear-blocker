(function () {

'use strict';

/******************************************************************************/

let µb = µBlock;

/******************************************************************************/

// Here we override the getNetFilteringSwitch() in the PageStore prototype to
// take into account the state of the global toggle.

let originalFactory = µb.PageStore.factory

µb.PageStore.factory = function(tabId, context) {
  let pageStore = originalFactory(tabId, context);
  let prototype = Object.getPrototypeOf(pageStore);
  let originalNetFilteringSwitch = prototype.getNetFilteringSwitch
  
  prototype.getNetFilteringSwitch = function () {
    let globalToggle = µb.blockbear.settings.blockBearEnabled;
    return globalToggle && originalNetFilteringSwitch.call(this);
  }

  µb.PageStore.factory = originalFactory;
  return pageStore;
}

/******************************************************************************/

})();