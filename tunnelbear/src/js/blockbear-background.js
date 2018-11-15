(function () {

'use strict';

/******************************************************************************/

var µb = µBlock;
if (µb.blockbear === undefined) {
  µb.blockbear = {}
}
var bb = µb.blockbear;

/******************************************************************************/

bb.settings = {
  blockBearEnabled: true,
  blockAdsEnabled: true,
  flashbearEnabled: true,
  blockBrowserFingerprintingEnabled: true,
  blockMicrophoneEnabled: true,
  blockKeyboardEnabled: true,
  blockMouseEnabled: true,
  blockEmailEnabled: true,
  blockSocialEnabled: true,
  blockPrivacyEnabled: true,
  blockMalwareEnabled: true,
  blockerBadgeAnimationEnabled: true,
  showPopupDetails: false
}

/******************************************************************************/

bb.browserType = (window.navigator.userAgent.indexOf("Firefox") > -1) ? "firefox" : "chrome";

/******************************************************************************/

bb.loadSettingsFromStorage = function (callback) {
  let settingsKey = 'blockbearSettings'
  vAPI.storage.get(settingsKey, function (result) {
    if (settingsKey in result) {
      let settings = result[settingsKey]
      for (let key in settings) {
        if (settings.hasOwnProperty(key) && bb.settings.hasOwnProperty(key)) {
          bb.settings[key] = settings[key]
        }
      }
    }
    callback()
  })
}

bb.saveSettingsToStorage = function () {
  vAPI.storage.set({ blockbearSettings: bb.settings });
}

/******************************************************************************/

bb.fetchLatestFilterLists = function () {
  µb.scheduleAssetUpdater(0);
  µb.assets.updateStart({
      delay: µb.hiddenSettings.manualUpdateAssetFetchPeriod
  });
}

/******************************************************************************/

let _firstInstall = µb.firstInstall
let timesSet = 0

Object.defineProperty(µb, "firstInstall", {
  get() {
    return _firstInstall;
  },
  set(value) {
    _firstInstall = value;
    timesSet++;
    if (timesSet === 2) {
      onStartup()
    }
  }
});

let onStartup = function () {
  bb.loadSettingsFromStorage(function () {
    bb.updateFilters();
    bb.fetchLatestFilterLists();
    setInterval(bb.fetchLatestFilterLists, 1000 * 60 * 60 * 24) // Look for updates every day
  });
}

/******************************************************************************/

µb.userSettings.contextMenuEnabled = false;
µb.userSettings.webrtcIPAddressHidden = true;

/******************************************************************************/

vAPI.storage.get(['installDate', 'promoReferenceDate'], function (result) {
  var setInstallDate = function setInstallDate() {
    var installDateObj = new Date();
    vAPI.storage.set({
      installDate: installDateObj.toString(),
      promoReferenceDate: installDateObj.toString()
    });
  };

  if (!result || !result.installDate || !result.promoReferenceDate) {
    setInstallDate();
  }
});

/******************************************************************************/

let browserObj = (bb.browserType === "firefox") ? browser : chrome;
browserObj.runtime.setUninstallURL("https://www.tunnelbear.com/account#/feedback/blocker");

/******************************************************************************/

})();
