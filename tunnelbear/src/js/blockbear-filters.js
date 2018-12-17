
(function () {

/******************************************************************************/

var µb = µBlock;
let bb = µb.blockbear

/******************************************************************************/

const adsLists = [
  "ublock-filters",
  "ublock-unbreak",
  "easylist",
  "plowe-0"
]

const privacyLists = [
  "ublock-privacy",
  "ublock-abuse",
  "easyprivacy"
]

const malwareLists = [
  "ublock-badware",
  "malware-0",
  "malware-1"
]

const socialLists = [
  "fanboy-social"
]

/******************************************************************************/

bb.classifyFilterList = function (list) {
  if (adsLists.includes(list)) {
    return 'ads'
  } else if (privacyLists.includes(list)) {
    return 'privacy'
  } else if (malwareLists.includes(list)) {
    return 'malware'
  } else if (socialLists.includes(list)) {
    return 'social'
  }
  return 'ads'
}

/******************************************************************************/

let getFilterListsToSelect = function (globalToggle, blockAds, blockPrivacy, blockMalware, blockSocial) {
  let ret = [];
  if (globalToggle === true) {
    if (blockAds) {
      ret = ret.concat(adsLists);
    }
    if (blockPrivacy) {
      ret = ret.concat(privacyLists);
    }
    if (blockMalware) {
      ret = ret.concat(malwareLists);
    }
    if (blockSocial) {
      ret = ret.concat(socialLists);
    }
  }
  return ret;
}

bb.updateFilters = function () {
  let globalToggle = bb.settings.blockBearEnabled;
  let blockAds = bb.settings.blockAdsEnabled;
  let blockPrivacy = bb.settings.blockPrivacyEnabled;
  let blockMalware = bb.settings.blockMalwareEnabled;
  let blockSocial = bb.settings.blockSocialEnabled;

  µb.applyFilterListSelection({
    toSelect: getFilterListsToSelect(globalToggle, blockAds, blockPrivacy, blockMalware, blockSocial),
    toRemove: [],
    toImport: ""
  });
  µb.loadFilterLists()
}

/******************************************************************************/

})();