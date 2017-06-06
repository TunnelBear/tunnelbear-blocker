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
    chrome.storage.local.get(installDateKey, function (result) {
        var setActivateDates = function setActivateDates(installDateStr) {
            var installDate = new Date(installDateStr);
            var twitterActivateDate = new Date(installDate.getTime());
            // var tb4cActivateDate = new Date(installDate.getTime());
            twitterActivateDate.setTime(twitterActivateDate.getTime() + 20 * 86400000);     // prompt in 20 days
            // tb4cActivateDate.setTime(tb4cActivateDate.getTime() + 8 * 86400000);     // prompt in 8 days
            chrome.storage.local.set({
                'twitterPromoTimestamp': twitterActivateDate.toString()
                // 'tb4cPromoTimestamp': tb4cActivateDate.toString()
            });
        };
        var setInstallDate = function setInstallDate() {
            var installDate = new Date();
            chrome.storage.local.set({
                'installDate': installDate.toString()
            });
            return installDate;
        };

        if (installDateKey in result) {
            if (result[installDateKey] === null) {
                var installDate = setInstallDate();
                setActivateDates(installDate.toString());
                return;
            }
            setActivateDates(result[installDateKey]);
        }
        else {
            var installDate = setInstallDate();
            setActivateDates(installDate.toString());
        }
    });
})();