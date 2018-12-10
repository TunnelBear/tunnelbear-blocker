(function () {

/******************************************************************************/

var messager = vAPI.messaging;
messager.addChannelListener('blockbearSettings');

/******************************************************************************/

var getSettingsData = function (callback) {
  var onDataReceived = function (response) {
    callback(response);
  };
  messager.send('blockbearSettings', { what: 'getSettingsData' }, onDataReceived);
};

function SettingsViewModel(settingsData) {
  this.reload = false;
  this.isLoaded = ko.observable(true);

  this.settingsBlockAdsEnabled = ko.observable(settingsData.blockAdsEnabled);
  this.settingsFlashEnabled = ko.observable(settingsData.flashbearEnabled);
  this.settingsBrowserFingerprintingEnabled = ko.observable(settingsData.blockBrowserFingerprintingEnabled);
  this.settingsBlockMicrophoneEnabled = ko.observable(settingsData.blockMicrophoneEnabled);
  this.settingsBlockKeyboardEnabled = ko.observable(settingsData.blockKeyboardEnabled);
  this.settingsBlockMouseEnabled = ko.observable(settingsData.blockMouseEnabled);
  this.settingsBlockEmailEnabled = ko.observable(settingsData.blockEmailEnabled);
  this.settingsBlockWebRTCEnabled = ko.observable(settingsData.blockWebRTCEnabled);
  this.settingsSocialEnabled = ko.observable(settingsData.blockSocialEnabled);
  this.settingsPrivacyEnabled = ko.observable(settingsData.blockPrivacyEnabled);
  this.settingsMalwareEnabled = ko.observable(settingsData.blockMalwareEnabled);
  this.settingsBlockerBadgeAnimationEnabled = ko.observable(settingsData.blockerBadgeAnimationEnabled);

  this.settingsBlockAdsText = ko.computed(function () {
    return this.settingsBlockAdsEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsFlashText = ko.computed(function () {
    return this.settingsFlashEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBrowserFingerprintingText = ko.computed(function () {
    return this.settingsBrowserFingerprintingEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockMicrophoneText = ko.computed(function () {
    return this.settingsBlockMicrophoneEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockKeyboardText = ko.computed(function () {
    return this.settingsBlockKeyboardEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockMouseText = ko.computed(function () {
    return this.settingsBlockMouseEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockEmailText = ko.computed(function () {
    return this.settingsBlockEmailEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockWebRTCText = ko.computed(function () {
    return this.settingsBlockWebRTCEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsBlockerBadgeAnimationText = ko.computed(function () {
    return this.settingsBlockerBadgeAnimationEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsSocialText = ko.computed(function () {
    return this.settingsSocialEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsPrivacyText = ko.computed(function () {
    return this.settingsPrivacyEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);
  this.settingsMalwareText = ko.computed(function () {
    return this.settingsMalwareEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
  }, this);

  this.toggleBlockAds = function () {
    var self = this;
    this.settingsBlockAdsEnabled(!this.settingsBlockAdsEnabled());
    setTimeout(function () {
      messager.send('blockbearSettings', { what: 'toggleBlockAds' }, function () {
        self.reload = true;
      });
    }, 500);
  };
  this.toggleFlash = function () {
    this.settingsFlashEnabled(!this.settingsFlashEnabled());
    messager.send('blockbearSettings', { what: 'toggleFlash' });
    this.reload = true;
  };
  this.toggleBrowserFingerprinting = function () {
    this.settingsBrowserFingerprintingEnabled(!this.settingsBrowserFingerprintingEnabled());
    messager.send('blockbearSettings', { what: 'toggleBrowserFingerprinting' });
    this.reload = true;
  };
  this.toggleBlockMicrophone = function () {
    this.settingsBlockMicrophoneEnabled(!this.settingsBlockMicrophoneEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockMicrophone' });
    this.reload = true;
  };
  this.toggleBlockKeyboard = function () {
    this.settingsBlockKeyboardEnabled(!this.settingsBlockKeyboardEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockKeyboard' });
    this.reload = true;
  };
  this.toggleBlockMouse = function () {
    this.settingsBlockMouseEnabled(!this.settingsBlockMouseEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockMouse' });
    this.reload = true;
  };
  this.toggleBlockEmail = function () {
    this.settingsBlockEmailEnabled(!this.settingsBlockEmailEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockEmail' });
    this.reload = true;
  };
  this.toggleBlockWebRTC = function () {
    this.settingsBlockWebRTCEnabled(!this.settingsBlockWebRTCEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockWebRTC' });
    this.reload = true;
  };
  this.toggleBlockerBadgeAnimation = function () {
    this.settingsBlockerBadgeAnimationEnabled(!this.settingsBlockerBadgeAnimationEnabled());
    messager.send('blockbearSettings', { what: 'toggleBlockerBadgeAnimation' });
    this.reload = true;
  };
  this.toggleSocial = function () {
    var self = this;
    this.settingsSocialEnabled(!this.settingsSocialEnabled());
    setTimeout(function () {
      messager.send('blockbearSettings', { what: 'toggleSocial' }, function () {
        self.reload = true;
      });
    }, 500);
  };
  this.togglePrivacy = function () {
    var self = this;
    this.settingsPrivacyEnabled(!this.settingsPrivacyEnabled());
    setTimeout(function () {
      messager.send('blockbearSettings', { what: 'togglePrivacy' }, function () {
        self.reload = true;
      });
    }, 500);
  };
  this.toggleMalware = function () {
    var self = this;
    this.settingsMalwareEnabled(!this.settingsMalwareEnabled());
    setTimeout(function () {
      messager.send('blockbearSettings', { what: 'toggleMalware' }, function () {
        self.reload = true;
      });
    }, 500);
  };
}

uDom.onLoad(function () {
  getSettingsData(function (response) {
    ko.applyBindings(new SettingsViewModel(response));
  });
});

if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
  document.body.classList.add("firefox");
}

/******************************************************************************/

})();
