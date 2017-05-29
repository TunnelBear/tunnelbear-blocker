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
            console.log('This is a first install!');
            var twitterActivateDate = moment();
            var tb4cActivateDate = moment();
            twitterActivateDate.add(1, 'minutes');      // after initial install, give them 2-4 weeks before prompting
            tb4cActivateDate.add(30, 'seconds');        // set to 2 weeks before prompting
            chrome.storage.local.set({
                'twitterPromoEnabled': false,
                'twitterPromoTimestamp': twitterActivateDate.toString(),
                'tb4cPromoEnabled': false,
                'tb4cPromoTimestamp': tb4cActivateDate.toString()
            });
            console.log(twitterActivateDate);
        }
    });    
})();