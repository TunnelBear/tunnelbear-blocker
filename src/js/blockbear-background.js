(function () {

    'use strict';

    var µb = µBlock;
    µb.userSettings.blockBearEnabled = true;
    µb.userSettings.blockAdsEnabled = true;
    µb.userSettings.flashbearEnabled = true;
    µb.userSettings.blockBrowserFingerprintingEnabled = true;
    µb.userSettings.blockMicrophoneEnabled = true;
    µb.userSettings.blockKeyboardEnabled = true;
    µb.userSettings.blockMouseEnabled = true;
    µb.userSettings.blockEmailEnabled = true;
    µb.userSettings.blockWebRTCEnabled = true;
    µb.userSettings.blockBlockAdBlockEnabled = false;
    µb.userSettings.blockSocialEnabled = true;
    µb.userSettings.blockPrivacyEnabled = true;
    µb.userSettings.blockMalwareEnabled = true;
    µb.userSettings.sendStatsEnabled = true;

    var installDateKey = 'installDate';
    vAPI.storage.get(installDateKey, function (result) {
        var setInstallDate = function setInstallDate() {
            var installDateObj = new Date();
            vAPI.storage.set({
                installDate: installDateObj.toString(),
                promos: {
                    twitter: {
                        completeDate: null,
                        dismissDate: null,
                        initialInterval: 20 * 24 * 60 * 60 * 1000     // 20 days
                    }
                }
            });
        };

        if (!result || !result[installDateKey]) {
            setInstallDate();
        }
    });
})();