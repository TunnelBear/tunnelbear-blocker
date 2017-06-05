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

    chrome.runtime.onInstalled.addListener(function (details) {
        if (details.reason === 'install') {
            var twitterActivateDate = moment();
            // var tb4cActivateDate = moment();
            twitterActivateDate.add(30, 'seconds');
            // tb4cActivateDate.add(60, 'seconds');
            chrome.storage.local.set({
                'twitterPromoTimestamp': twitterActivateDate.toString()
                // 'tb4cPromoEnabled': false,
                // 'tb4cPromoTimestamp': tb4cActivateDate.toString()
            });
        }
    });    
})();