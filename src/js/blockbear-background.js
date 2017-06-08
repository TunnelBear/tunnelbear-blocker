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
            var installDate = new Date();
            vAPI.storage.set({
                'installDate': installDate.toString(),
                'promos': {
                    'twitterCompleteDate': null,
                    'twitterDismissDate': null
                }
            });
        };

        if (!result || !result[installDateKey]) {
            setInstallDate();
        }
    });
})();