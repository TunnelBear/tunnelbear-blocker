/******************************************************************************/
/******************************************************************************/

'use strict';

(function () {

/******************************************************************************/

var µb = µBlock;
let bb = µb.blockbear;

/******************************************************************************/

var onMessage = function (request, sender, callback) {
  // Async
  switch (request.what) {
    default:
      break;
  }

  // Sync
  var response;

  var pageStore;
  if (sender && sender.tab) {
    pageStore = µb.pageStoreFromTabId(sender.tab.id);
  }
  let blockedCounts = bb.getBlockedCounts(sender.tab.id);

  switch (request.what) {
    case 'blockFlash':
      response = {
        result: pageStore && pageStore.getNetFilteringSwitch() && bb.settings.blockBearEnabled && bb.settings.flashbearEnabled
      };
      break;
    case 'incrementFlashCount':
      blockedCounts.flashBlocked++
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'decrementFlashCount':
      if (blockedCounts.flashBlocked > 0) {
        blockedCounts.flashBlocked--;
        µb.updateToolbarIcon(sender.tab.id);
      }
      break;
    case 'blockEmailEnabled':
      response = bb.settings.blockEmailEnabled && bb.settings.blockBearEnabled;
      break;
    case 'pixel-tracking':
      blockedCounts.emailBlocked++
      µb.updateToolbarIcon(sender.tab.id);
      break;
    default:
      return vAPI.messaging.UNHANDLED;
  }

  callback(response);
};

vAPI.messaging.listen('blockbear-contentscript-end.js', onMessage);

})();

/******************************************************************************/
/******************************************************************************/

(function () {

/******************************************************************************/

var µb = µBlock;
let bb = µb.blockbear;

/******************************************************************************/

var onMessage = function (request, sender, callback) {
  // Async
  switch (request.what) {
    default:
      break;
  }

  // Sync
  var response;

  var pageStore;
  if (sender && sender.tab) {
    pageStore = µb.pageStoreFromTabId(sender.tab.id);
  }
  let blockedCounts = bb.getBlockedCounts(sender.tab.id);

  switch (request.what) {
    case 'blockBrowserFingerprinting':
      response = {
        blockFingerprinting: pageStore && pageStore.getNetFilteringSwitch() && bb.settings.blockBearEnabled && bb.settings.blockBrowserFingerprintingEnabled,
        blockMicrophone: pageStore && pageStore.getNetFilteringSwitch() && bb.settings.blockBearEnabled && bb.settings.blockMicrophoneEnabled,
        blockKeyboard: pageStore && pageStore.getNetFilteringSwitch() && bb.settings.blockBearEnabled && bb.settings.blockKeyboardEnabled,
        blockMouse: pageStore && pageStore.getNetFilteringSwitch() && bb.settings.blockBearEnabled && bb.settings.blockMouseEnabled,
      };
      if (!response.blockFingerprinting && blockedCounts.fingerprintingBlocked > 0) {
        blockedCounts.fingerprintingBlocked = 0;
        µb.updateToolbarIcon(sender.tab.id);
      }
      break;
    case 'clearFingerprintingCount':
      blockedCounts.fingerprintingBlocked = 0;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'incrementFingerprintingCount':
      console.log(pageStore.tabHostname + ": " + request.message);
      if (request.data) {
        console.log(request.data);
      }
      blockedCounts.fingerprintingBlocked++;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'decrementFingerprintingCount':
      if (blockedCounts.fingerprintingBlocked > 0) {
        blockedCounts.fingerprintingBlocked--;
        µb.updateToolbarIcon(sender.tab.id);
      }
      break;

    case 'clearKeyboardCount':
      blockedCounts.keyboardBlocked = 0;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'incrementKeyboardCount':
      console.log(pageStore.tabHostname + ": " + request.message);
      if (request.data) {
        console.log(request.data);
      }
      blockedCounts.keyboardBlocked++
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'clearMouseCount':
      blockedCounts.mouseBlocked = 0;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'incrementMouseCount':
      console.log(pageStore.tabHostname + ": " + request.message);
      if (request.data) {
        console.log(request.data);
      }
      blockedCounts.mouseBlocked++;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'clearMicrophoneCount':
      blockedCounts.ultrasonicBlocked = 0;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    case 'incrementMicrophoneCount':
      console.log(pageStore.tabHostname + ": " + request.message);
      if (request.data) {
        console.log(request.data);
      }
      blockedCounts.ultrasonicBlocked++;
      µb.updateToolbarIcon(sender.tab.id);
      break;
    default:
      return vAPI.messaging.UNHANDLED;
  }

  callback(response);
};

vAPI.messaging.listen('blockbear-contentscript-start.js', onMessage);

})();

/******************************************************************************/
/******************************************************************************/

(function () {

/******************************************************************************/

var µb = µBlock;
let bb = µb.blockbear;

/******************************************************************************/

let getPopupData = function (tabId) {
  let tabContext = µb.tabContextManager.mustLookup(tabId);
  
  let data = {
    // Info
    tabId: tabId,
    pageURL: tabContext.normalURL,
    pageDomain: tabContext.rootDomain,

    // Toggles
    blockBearEnabled: bb.settings.blockBearEnabled,
    netFilteringSwitch: false,
    blockAdsEnabled: bb.settings.blockAdsEnabled,
    flashbearEnabled: bb.settings.flashbearEnabled,
    blockBrowserFingerprintingEnabled: bb.settings.blockBrowserFingerprintingEnabled,
    blockMicrophoneEnabled: bb.settings.blockMicrophoneEnabled,
    blockKeyboardEnabled: bb.settings.blockKeyboardEnabled,
    blockMouseEnabled: bb.settings.blockMouseEnabled,
    blockEmailEnabled: bb.settings.blockEmailEnabled,
    blockSocialEnabled: bb.settings.blockSocialEnabled,
    blockPrivacyEnabled: bb.settings.blockPrivacyEnabled,
    blockMalwareEnabled: bb.settings.blockMalwareEnabled,
    showPopupDetails: bb.settings.showPopupDetails,

    // Counts
    pageBlockedRequestCount: 0,
    pageBlockedAdsCount: 0,
    pageBlockedFlashCount: 0,
    pageBlockedFingerprintingCount: 0,
    pageBlockedEmailCount: 0,
    pageBlockedKeyboardCount: 0,
    pageBlockedMouseCount: 0,
    pageBlockedMicrophoneCount: 0,
    pageBlockedSocialCount: 0,
    pageBlockedPrivacyCount: 0,
    pageBlockedMalwareCount: 0
  }

  let pageStore = µb.pageStoreFromTabId(tabId);
  let blockCounts = bb.getBlockedCounts(tabId);
  if ( pageStore ) {
    data.netFilteringSwitch = pageStore.getNetFilteringSwitch();
    data.pageBlockedRequestCount = pageStore.perLoadBlockedRequestCount;
    data.pageBlockedAdsCount = blockCounts.adsBlocked
    data.pageBlockedFlashCount = blockCounts.flashBlocked
    data.pageBlockedFingerprintingCount = blockCounts.fingerprintingBlocked
    data.pageBlockedEmailCount = blockCounts.emailBlocked
    data.pageBlockedMicrophoneCount = blockCounts.ultrasonicBlocked
    data.pageBlockedSocialCount = blockCounts.socialBlocked
    data.pageBlockedPrivacyCount = blockCounts.privacyBlocked
    data.pageBlockedMalwareCount = blockCounts.malwareBlocked
  }

  return data
}

let getActiveTab = function (callback) {
  vAPI.tabs.get(null, function (tab) {
    var tabId = '';
    if (tab) {
      tabId = tab.id;
    }
    callback(tabId);
  })
}

var onMessage = function (request, sender, callback) {

  if (request.what === 'getPopupData') {
    getActiveTab(function (tabId) {
      callback(getPopupData(tabId));
    })
    return;
  }

  var response;
  
  switch ( request.what ) {
    case 'toggleBlockBear':
      bb.settings.blockBearEnabled = !bb.settings.blockBearEnabled;
      bb.updateFilters();
      break;
    case 'toggleDomainWhitelist':
      let pageStore = µb.pageStoreFromTabId(request.tabId);
      if ( pageStore ) {
        pageStore.toggleNetFilteringSwitch(request.url, request.scope, request.state);
      }
      break;
    case 'toggleBlockAds':
      bb.settings.blockAdsEnabled = !bb.settings.blockAdsEnabled;
      bb.updateFilters();
      break;
    case 'toggleFlash':
      bb.settings.flashbearEnabled = !bb.settings.flashbearEnabled;
      break;
    case 'toggleBrowserFingerprinting':
      bb.settings.blockBrowserFingerprintingEnabled = !bb.settings.blockBrowserFingerprintingEnabled;
      break;
    case 'toggleBlockEmail':
      bb.settings.blockEmailEnabled = !bb.settings.blockEmailEnabled;
      break;
    case 'toggleBlockKeyboard':
      bb.settings.blockKeyboardEnabled = !bb.settings.blockKeyboardEnabled;
      break;
    case 'toggleBlockMouse':
      bb.settings.blockMouseEnabled = !bb.settings.blockMouseEnabled;
      break;
    case 'toggleBlockMicrophone':
      bb.settings.blockMicrophoneEnabled = !bb.settings.blockMicrophoneEnabled;
      break;
    case 'toggleSocial':
      bb.settings.blockSocialEnabled = !bb.settings.blockSocialEnabled;
      bb.updateFilters();
      break;
    case 'togglePrivacy':
      bb.settings.blockPrivacyEnabled = !bb.settings.blockPrivacyEnabled;
      bb.updateFilters();
      break;
    case 'toggleMalware':
      bb.settings.blockMalwareEnabled = !bb.settings.blockMalwareEnabled;
      bb.updateFilters();
      break;
    case 'toggleShowPopupDetails':
      bb.settings.showPopupDetails = !bb.settings.showPopupDetails;
      break;
    default:
      return vAPI.messaging.UNHANDLED;
  }
  bb.saveSettingsToStorage();

  callback(response);
}

vAPI.messaging.listen('blockbearPopup', onMessage);

})();

/******************************************************************************/
/******************************************************************************/

(function () {

/******************************************************************************/

var µb = µBlock;
let bb = µb.blockbear;

/******************************************************************************/

let onMessage = function (request, sender, callback) {

  if (request.what === "getSettingsData") {
    let settingsData = Object.assign({}, bb.settings);
    settingsData.blockWebRTCEnabled = µb.userSettings.webrtcIPAddressHidden;
    callback(settingsData);
    return;
  }

  var response;

  switch ( request.what ) {
    case 'toggleBlockAds':
      bb.settings.blockAdsEnabled = !bb.settings.blockAdsEnabled;
      bb.updateFilters();
      break;
    case 'toggleFlash':
      bb.settings.flashbearEnabled = !bb.settings.flashbearEnabled;
      break;
    case 'toggleBrowserFingerprinting':
      bb.settings.blockBrowserFingerprintingEnabled = !bb.settings.blockBrowserFingerprintingEnabled;
      break;
    case 'toggleBlockMicrophone':
      bb.settings.blockMicrophoneEnabled = !bb.settings.blockMicrophoneEnabled;
      break;
    case 'toggleBlockKeyboard':
      bb.settings.blockKeyboardEnabled = !bb.settings.blockKeyboardEnabled;
      break;
    case 'toggleBlockMouse':
      bb.settings.blockMouseEnabled = !bb.settings.blockMouseEnabled;
      break;
    case 'toggleBlockEmail':
      bb.settings.blockEmailEnabled = !bb.settings.blockEmailEnabled;
      break;
    case 'toggleBlockWebRTC':
      µb.changeUserSettings('webrtcIPAddressHidden', !µb.userSettings.webrtcIPAddressHidden);
      break;
    case 'toggleBlockerBadgeAnimation':
      bb.settings.blockerBadgeAnimationEnabled = !bb.settings.blockerBadgeAnimationEnabled;
      break;
    case 'toggleSocial':
      bb.settings.blockSocialEnabled = !bb.settings.blockSocialEnabled;
      bb.updateFilters();
      break;
    case 'togglePrivacy':
      bb.settings.blockPrivacyEnabled = !bb.settings.blockPrivacyEnabled;
      bb.updateFilters();
      break;
    case 'toggleMalware':
      bb.settings.blockMalwareEnabled = !bb.settings.blockMalwareEnabled;
      bb.updateFilters();
      break;
    default:
      return vAPI.messaging.UNHANDLED;
  }

  callback(response)
}

vAPI.messaging.listen('blockbearSettings', onMessage);

})();
