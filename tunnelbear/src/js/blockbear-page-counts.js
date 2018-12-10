
'use strict';

/******************************************************************************/
/******************************************************************************/

(function () {

/******************************************************************************/

var µb = µBlock;
var bb = µb.blockbear;

/******************************************************************************/

// Store blocked counts for each tabs
let tabsCounts = new Map();

function makeEmptyTabCounts(pageLoadCounter) {
  let ret = {
    adsBlocked: 0,
    flashBlocked: 0,
    fingerprintingBlocked: 0,
    keyboardBlocked: 0,
    mouseBlocked: 0,
    emailBlocked: 0,
    ultrasonicBlocked: 0,
    socialBlocked: 0,
    privacyBlocked: 0,
    malwareBlocked: 0
  }
  if (pageLoadCounter !== undefined) {
    ret.pageLoadCounter = pageLoadCounter;
  }
  return ret;
}

function resetTabCounters(tabId) {
  let newLoadCounter = 0;
  if (tabsCounts.has(tabId)) {
    newLoadCounter = (tabsCounts.get(tabId).pageLoadCounter + 1) % 0xFFFFFFFF;
  }
  tabsCounts.set(tabId, makeEmptyTabCounts(newLoadCounter))
}

function pruneTabsCounts() {
  let tabsHandler = function (openTabs) {
    let openTabIds = new Set(openTabs.map(tab => tab.id));
    [...tabsCounts.keys()].forEach(function (tabId) {
      if (!openTabIds.has(tabId)) {
        tabsCounts.delete(tabId);
      }
    })
  }
  if (bb.browserType === "firefox") {
    browser.tabs.query({}).then(tabsHandler);
  } else {
    chrome.tabs.query({}, tabsHandler);
  }
}

setInterval(pruneTabsCounts, 30 * 1000);

/******************************************************************************/

function onLogBufferRead(logEntries) {
  let isBlockedEntry = entry => entry.d0 !== undefined && entry.d0.result === 1
  let isMainFrame = entry => entry.d1 === "main_frame"
  
  let filteredEntries = logEntries
    .filter(entry => tabsCounts.has(entry.tab))
    .filter(entry => isMainFrame(entry) || isBlockedEntry(entry))

  filteredEntries.forEach(function (entry) {
    if (isMainFrame(entry)) {
      resetTabCounters(entry.tab)
    } else {
      let loadCounter = bb.getBlockedCounts(entry.tab).pageLoadCounter;
      classifyBlockedEntry(entry, loadCounter);
    }
  })
}

function classifyBlockedEntry(entry, loadCounter, tries) {
  if (tries !== undefined && tries >= 5) {
    console.log("Unable to find list for: " + JSON.stringify(entry));
    return;
  }
  let compiled = entry.d0.compiled
  let raw = entry.d0.raw
  µb.staticFilteringReverseLookup.fromNetFilter(compiled, raw, result => {
    let counts = µb.blockbear.getBlockedCounts(entry.tab);
    if (counts.pageLoadCounter !== loadCounter) {
      return;
    }
    
    if (result[raw] && result[raw].length > 0) {
      let filterListKey = result[raw][0].assetKey;
      let category = µb.blockbear.classifyFilterList(filterListKey);
      if (category === 'ads') {
        counts.adsBlocked++;
      } else if (category === 'privacy') {
        counts.privacyBlocked++;
      } else if (category === 'malware') {
        counts.malwareBlocked++;
      } else if (category === 'social') {
        counts.socialBlocked++;
      }
    } else {
      setTimeout(function () {
        classifyBlockedEntry(entry, loadCounter, tries === undefined ? 1 : tries + 1);
      }, 200);
    }
  });
}

let loggerOwnerId = Date.now()

function readLogBuffer() {
  let logEntries = µb.logger.readAll(loggerOwnerId);
  onLogBufferRead(logEntries);
}

setInterval(readLogBuffer, 1500)

/******************************************************************************/

µb.blockbear.getBlockedCounts = function (tabId) {
  if (!tabsCounts.has(tabId)) {
    resetTabCounters(tabId);
  }
  return tabsCounts.get(tabId);
}

/******************************************************************************/

})();