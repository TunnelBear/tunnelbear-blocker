(function () {

'use strict';

/******************************************************************************/

var µb = µBlock;

/******************************************************************************/

var toChromiumTabId = function (tabId) {
  if (typeof tabId === 'string') {
    tabId = parseInt(tabId, 10);
  }
  if (typeof tabId !== 'number' || isNaN(tabId) || tabId === -1) {
    return 0;
  }
  return tabId;
};

var IconState = function (badge, img) {
  this.badge = badge;
  // ^ a number -- the badge 'value'
  this.img = img;
  // ^ a string -- 'on' or 'off'
  this.dirty = (1 << 1) | (1 << 0);
  /* ^ bitmask AB: two bits, A and B
          where A is whether img has changed and needs render
          and B is whether badge has changed and needs render */
};
var iconStateForTabId = {}; // {tabId: IconState}

var ICON_PATHS = {
  "on": { '16': 'img/icon_16.png', '32': 'img/icon_32.png' },
  "on1": { '16': 'img/icon01.png', '32': 'img/icon01@2x.png' },
  "on2": { '16': 'img/icon02.png', '32': 'img/icon02@2x.png' },
  "on3": { '16': 'img/icon03.png', '32': 'img/icon03@2x.png' },
  "off": { '16': 'img/icon_16-off.png', '32': 'img/icon_32-off.png' }
};

var iconAnimations = [];
var iconAnimated = false;

vAPI.setIcon = function (tabId, iconStatus, badge) {
  if (µb.blockbear.settings.blockerBadgeAnimationEnabled === false) {
    chrome.browserAction.setIcon({ path: ICON_PATHS['on'] });
    return;
  }
  tabId = toChromiumTabId(tabId);
  if (tabId === 0) {
    return;
  }
  var stopIconAnimation = function () {
    iconAnimated = false;
  }
  var playIconAnimation = function (tabId, i, badge) {
    iconAnimated = true;
    var icon = "on";
    if (!i) {
      i = 0;
    }
    if (i > 0 && i < 4) {
      icon += i;
    }
    chrome.browserAction.setIcon({ tabId: tabId, path: ICON_PATHS[icon] }, function () {
      if (vAPI.lastError()) {
        stopIconAnimation();
        return;
      }
      if (badge == 0) {
        stopIconAnimation();
      } else {
        setTimeout(function () {
          if (i == 1) {
            chrome.browserAction.setBadgeBackgroundColor({ tabId: tabId, color: '#666' });
            chrome.browserAction.setBadgeText({ tabId: tabId, text: '' });
          } else {
            // if (i == 3) {
            //     chrome.browserAction.setBadgeText({ tabId: tabId, text: badge });
            // }
          }
          i++;
          if (i < 5) {
            playIconAnimation(tabId, i, badge);
          } else {
            if (iconAnimations.length > 0) {
              var anim = iconAnimations.shift();
              playIconAnimation(anim.tabId, 0, anim.badge);
            } else {
              stopIconAnimation();
              chrome.browserAction.setBadgeText({ tabId: tabId, text: badge });
            }
          }
        }, 100);
      }
    });
  }
  var state = iconStateForTabId[tabId];
  if (typeof state === "undefined") {
    state = iconStateForTabId[tabId] = new IconState(badge, iconStatus);
  }
  else {
    state.oldBadge = state.badge;
    state.dirty = ((state.badge !== badge) << 1) | ((state.img !== iconStatus) << 0);
    state.badge = badge;
    state.img = iconStatus;
  }
  if ((state.dirty & 1) || (state.dirty & 2)) { // got a new icon?
    if (badge && state.oldBadge < badge) {
      console.log('SET BADGE: ' + badge);
      if (iconAnimated) {
        iconAnimations.push({ tabId: tabId, badge: badge });
      } else {
        playIconAnimation(tabId, 0, badge);
      }
    } else {
      chrome.browserAction.setIcon({ tabId: tabId, path: ICON_PATHS[iconStatus] });
    }
  } else {
    chrome.browserAction.setIcon({ tabId: tabId, path: ICON_PATHS[iconStatus] });
  }
};

/******************************************************************************/

µb.updateToolbarIcon = (function () {
  var tabIdToTimer = Object.create(null);

  var updateBadge = function (tabId) {
    delete tabIdToTimer[tabId];

    var state = false;
    var badge = '';

    var pageStore = this.pageStoreFromTabId(tabId);
    var blockedCounts = this.blockbear.getBlockedCounts(tabId);
    if (pageStore !== null) {
      state = pageStore.getNetFilteringSwitch();
      if (state && this.userSettings.showIconBadge) {
        badge = this.formatCount(
          pageStore.perLoadBlockedRequestCount +
          blockedCounts.flashBlocked +
          blockedCounts.fingerprintingBlocked +
          blockedCounts.emailBlocked +
          blockedCounts.keyboardBlocked +
          blockedCounts.mouseBlocked +
          blockedCounts.ultrasonicBlocked
        );
      }
    }

    vAPI.setIcon(tabId, state ? 'on' : 'off', badge);
  };

  return function (tabId) {
    if (tabIdToTimer[tabId]) {
      return;
    }
    if (vAPI.isBehindTheSceneTabId(tabId)) {
      return;
    }
    tabIdToTimer[tabId] = vAPI.setTimeout(updateBadge.bind(this, tabId), 666);
  };
})();

/******************************************************************************/

})();