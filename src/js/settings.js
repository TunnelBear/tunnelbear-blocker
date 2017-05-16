(function () {
    var messager = vAPI.messaging;
    messager.addChannelListener('settings');

    var getSettingsData = function (callback) {
        var onDataReceived = function (response) {
            callback(response);
        };
        messager.send('settings', { what: 'getSettingsData', tabId: null }, onDataReceived);
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
        this.settingsBlockBlockAdBlockEnabled = ko.observable(settingsData.blockBlockAdBlockEnabled);
        this.settingsSocialEnabled = ko.observable(settingsData.blockSocialEnabled);
        this.settingsPrivacyEnabled = ko.observable(settingsData.blockPrivacyEnabled);
        this.settingsMalwareEnabled = ko.observable(settingsData.blockMalwareEnabled);

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
        this.settingsBlockBlockAdBlockText = ko.computed(function () {
            return this.settingsBlockBlockAdBlockEnabled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
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
                messager.send('settings', { what: 'toggleBlockAds' }, function () {
                    self.reload = true;
                });
            }, 500);
        };
        this.toggleFlash = function () {
            this.settingsFlashEnabled(!this.settingsFlashEnabled());
            messager.send('settings', { what: 'toggleFlash' });
            this.reload = true;
        };
        this.toggleBrowserFingerprinting = function () {
            this.settingsBrowserFingerprintingEnabled(!this.settingsBrowserFingerprintingEnabled());
            messager.send('settings', { what: 'toggleBrowserFingerprinting' });
            this.reload = true;
        };
        this.toggleBlockMicrophone = function () {
            this.settingsBlockMicrophoneEnabled(!this.settingsBlockMicrophoneEnabled());
            messager.send('settings', { what: 'toggleBlockMicrophone' });
            this.reload = true;
        };
        this.toggleBlockKeyboard = function () {
            this.settingsBlockKeyboardEnabled(!this.settingsBlockKeyboardEnabled());
            messager.send('settings', { what: 'toggleBlockKeyboard' });
            this.reload = true;
        };
        this.toggleBlockMouse = function () {
            this.settingsBlockMouseEnabled(!this.settingsBlockMouseEnabled());
            messager.send('settings', { what: 'toggleBlockMouse' });
            this.reload = true;
        };
        this.toggleBlockEmail = function () {
            this.settingsBlockEmailEnabled(!this.settingsBlockEmailEnabled());
            messager.send('settings', { what: 'toggleBlockEmail' });
            this.reload = true;
        };
        this.toggleBlockWebRTC = function () {
            this.settingsBlockWebRTCEnabled(!this.settingsBlockWebRTCEnabled());
            messager.send('settings', { what: 'toggleBlockWebRTC' });
            this.reload = true;
        };
        this.toggleBlockBlockAdBlock = function () {
            this.settingsBlockBlockAdBlockEnabled(!this.settingsBlockBlockAdBlockEnabled());
            messager.send('settings', { what: 'toggleBlockBlockAdBlock' });
            this.reload = true;
        };
        this.toggleSocial = function () {
            var self = this;
            this.settingsSocialEnabled(!this.settingsSocialEnabled());
            setTimeout(function () {
                messager.send('settings', { what: 'toggleSocial' }, function () {
                    self.reload = true;
                });
            }, 500);
        };
        this.togglePrivacy = function () {
            var self = this;
            this.settingsPrivacyEnabled(!this.settingsPrivacyEnabled());
            setTimeout(function () {
                messager.send('settings', { what: 'togglePrivacy' }, function () {
                    self.reload = true;
                });
            }, 500);
        };
        this.toggleMalware = function () {
            var self = this;
            this.settingsMalwareEnabled(!this.settingsMalwareEnabled());
            setTimeout(function () {
                messager.send('settings', {what: 'toggleMalware'}, function () {
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

})();
