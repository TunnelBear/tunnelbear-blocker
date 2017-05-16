(function () {

    'use strict';

    var µb = µBlock;

    var onMessage = function (request, sender, callback) {
        // Async
        switch (request.what) {
            default:
                break;
        }

        // Sync
        var response;

        var pageStore;
        if (sender && sender.tab) {
            pageStore = µb.pageStoreFromTabId(sender.tab.id);
        }

        switch (request.what) {
            case 'blockFlash':
                response = {
                    result: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.flashbearEnabled
                };
                break;
            case 'incrementFlashCount':
                pageStore.perLoadBlockedFlashCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'decrementFlashCount':
                if(pageStore.perLoadBlockedFlashCount > 0) {
                    pageStore.perLoadBlockedFlashCount--;
                    µb.updateBadgeAsync(sender.tab.id);
                }
                break;
            case 'blockEmailEnabled':
                response = µb.userSettings.blockEmailEnabled;
                break;
            case 'pixel-tracking':
                pageStore.perLoadBlockedEmailCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            default:
                return vAPI.messaging.UNHANDLED;
        }

        callback(response);
    };

    vAPI.messaging.listen('blockbear-contentscript-end.js', onMessage);
    
})();

(function () {

    'use strict';

    var µb = µBlock;

    var onMessage = function (request, sender, callback) {
        // Async
        switch (request.what) {
            default:
                break;
        }

        // Sync
        var response;

        var pageStore;
        if (sender && sender.tab) {
            pageStore = µb.pageStoreFromTabId(sender.tab.id);
        }

        switch (request.what) {
            case 'blockBrowserFingerprinting':
                response = {
                    blockFingerprinting: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.blockBrowserFingerprintingEnabled,
                    blockMicrophone: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.blockMicrophoneEnabled,
                    blockKeyboard: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.blockKeyboardEnabled,
                    blockMouse: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.blockMouseEnabled,
                    blockBlockAdBlock: pageStore && pageStore.netFilteringSwitchEnabled() && µb.userSettings.blockBearEnabled && µb.userSettings.blockBlockAdBlockEnabled,
                };
                if (!response.blockFingerprinting && pageStore.perLoadBlockedFingerprintingCount > 0) {
                    pageStore.perLoadBlockedFingerprintingCount = 0;
                    µb.updateBadgeAsync(sender.tab.id);
                }
                break;
            case 'clearFingerprintingCount':
                pageStore.perLoadBlockedFingerprintingCount = 0;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'incrementFingerprintingCount':
                console.log(pageStore.tabHostname + ": " + request.message);
                if (request.data) {
                    console.log(request.data);
                }
                pageStore.perLoadBlockedFingerprintingCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'decrementFingerprintingCount':
                if(pageStore.perLoadBlockedFingerprintingCount > 0) {
                    pageStore.perLoadBlockedFingerprintingCount--;
                    µb.updateBadgeAsync(sender.tab.id);
                }
                break;

            case 'clearKeyboardCount':
                pageStore.perLoadBlockedKeyboardCount = 0;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'incrementKeyboardCount':
                console.log(pageStore.tabHostname + ": " + request.message);
                if (request.data) {
                    console.log(request.data);
                }
                pageStore.perLoadBlockedKeyboardCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'clearMouseCount':
                pageStore.perLoadBlockedMouseCount = 0;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'incrementMouseCount':
                console.log(pageStore.tabHostname + ": " + request.message);
                if (request.data) {
                    console.log(request.data);
                }
                pageStore.perLoadBlockedMouseCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'clearMicrophoneCount':
                pageStore.perLoadBlockedMicrophoneCount = 0;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            case 'incrementMicrophoneCount':
                console.log(pageStore.tabHostname + ": " + request.message);
                if (request.data) {
                    console.log(request.data);
                }
                pageStore.perLoadBlockedMicrophoneCount++;
                µb.updateBadgeAsync(sender.tab.id);
                break;
            default:
                return vAPI.messaging.UNHANDLED;
        }

        callback(response);
    };

    vAPI.messaging.listen('blockbear-contentscript-start.js', onMessage);
    
})();