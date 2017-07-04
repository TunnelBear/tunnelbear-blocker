(function () {
    var messager = vAPI.messaging;
    messager.addChannelListener('popupPanel');

    var getPopupData = function (callback) {
        var onDataReceived = function (response) {
            callback(response);
        };
        messager.send('popupPanel', { what: 'getPopupData', tabId: null }, onDataReceived);
    }

    function PopupViewModel(popupData) {
        this.isLoaded = ko.observable(true);
        this.isToggleShowDetails = ko.observable(popupData.showPopupDetails);
        this.domain = ko.observable(popupData.pageDomain);
        this.pageBlockedRequestCount = ko.observable(popupData.pageBlockedRequestCount);
        this.pageBlockedAdsCount = ko.observable(popupData.pageBlockedAdsCount);
        this.pageBlockedFlashCount = ko.observable(popupData.pageBlockedFlashCount);
        this.pageBlockedFingerprintingCount = ko.observable(popupData.pageBlockedFingerprintingCount);
        this.pageBlockedEmailCount = ko.observable(popupData.pageBlockedEmailCount);
        this.pageBlockedKeyboardCount = ko.observable(popupData.pageBlockedKeyboardCount);
        this.pageBlockedMouseCount = ko.observable(popupData.pageBlockedMouseCount);
        this.pageBlockedMicrophoneCount = ko.observable(popupData.pageBlockedMicrophoneCount);
        this.pageBlockedSocialCount = ko.observable(popupData.pageBlockedSocialCount);
        this.pageBlockedPrivacyCount = ko.observable(popupData.pageBlockedPrivacyCount);
        this.pageBlockedMalwareCount = ko.observable(popupData.pageBlockedMalwareCount);
        this.pageBlockedCount = ko.computed(function () {
            return this.pageBlockedRequestCount() 
            + this.pageBlockedFlashCount() 
            + this.pageBlockedFingerprintingCount()
            + this.pageBlockedEmailCount()
            + this.pageBlockedKeyboardCount()
            + this.pageBlockedMouseCount()
            + this.pageBlockedMicrophoneCount();
        }, this);
        this.pageBlockedPercentage = ko.computed(function () {
            var count = this.pageBlockedCount();
            if (count == 0 || this.isToggleShowDetails()) {
                return '0%';
            } else {
                if (count > 100) {
                    return "100%";
                } else {
                    return this.pageBlockedCount() + '%';
                }
            }
        }, this);
        this.pageBlockedFlashPercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedFlashCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedFingerprintingPercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedFingerprintingCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedEmailPercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedEmailCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedKeyboardPercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedKeyboardCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedMousePercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedMouseCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedMicrophonePercentage = ko.computed(function () {
            if (this.pageBlockedCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedMicrophoneCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedAdsPercentage = ko.computed(function () {
            if (this.pageBlockedAdsCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedAdsCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedSocialPercentage = ko.computed(function () {
            if (this.pageBlockedSocialCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedSocialCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedPrivacyPercentage = ko.computed(function () {
            if (this.pageBlockedPrivacyCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedPrivacyCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedMalwarePercentage = ko.computed(function () {
            if (this.pageBlockedMalwareCount() == 0 || !this.isToggleShowDetails()) {
                return '0%';
            }
            return (this.pageBlockedMalwareCount() / this.pageBlockedCount() * 100) + '%';
        }, this);
        this.pageBlockedText = ko.computed(function () {
            return chrome.i18n.getMessage("popupBlocked")
        }, this);

        this.isToggled = ko.observable(popupData.blockBearEnabled);
        this.isWhitelisted = ko.observable(popupData.netFilteringSwitch);

        this.blockAdsEnabled = ko.observable(popupData.blockAdsEnabled);
        this.flashEnabled = ko.observable(popupData.flashbearEnabled);
        this.browserFingerprintingEnabled = ko.observable(popupData.blockBrowserFingerprintingEnabled);
        this.blockMicrophoneEnabled = ko.observable(popupData.blockMicrophoneEnabled);
        this.blockKeyboardEnabled = ko.observable(popupData.blockKeyboardEnabled);
        this.blockMouseEnabled = ko.observable(popupData.blockMouseEnabled);
        this.blockEmailEnabled = ko.observable(popupData.blockEmailEnabled);
        this.blockBlockAdBlockEnabled = ko.observable(popupData.blockBlockAdBlockEnabled);
        this.blockBlockWebRTCEnabled = ko.observable(popupData.blockBlockWebRTCEnabled);
        this.socialEnabled = ko.observable(popupData.blockSocialEnabled);
        this.privacyEnabled = ko.observable(popupData.blockPrivacyEnabled);
        this.malwareEnabled = ko.observable(popupData.blockMalwareEnabled);
        
        this.twitterPromoEnabled = ko.observable(false); 

        var self = this;
        var dismissKey = 'dismissDate';
        var completeKey = 'completeDate';

        this.shouldShowTwitterPromo = function (completeDate, dismissDate, installDate) {
            var daysBeforeShowing = 20;
            var daysBeforeShowingIfDismissed = 180;
            return self.shouldShowPromo(completeDate, dismissDate, installDate, daysBeforeShowing, daysBeforeShowingIfDismissed);
        }

        var promoList = [{
            name: 'twitter',
            shouldShow: this.shouldShowTwitterPromo,
            completeDate: undefined,
            dismissDate: undefined,
            priority: 0
        }];

        // Returns promo object from promo list
        this.findPromoFromList = function (promoName) {
            for (var promo in promoList) {
                if (promoList[promo].name === promoName) {
                    return promoList[promo];
                }
            }
            return undefined;
        }

        // Determines the highest priority promo to be shown
        this.grabPromo = function (storagePromos, installDate) {
            for (var item in storagePromos) {
                var promoObj = this.findPromoFromList(storagePromos[item].name);
                if (promoObj != null) {
                    promoObj.completeDate = storagePromos[item].completeDate;
                    promoObj.dismissDate = storagePromos[item].dismissDate;
                }
            }
            var promosToShow = promoList.filter(function (promo) {
                return promo.shouldShow(promo.completeDate, promo.dismissDate, installDate) === true;
            });
            var sortedPromos = promosToShow.sort(function (current, previous) {
                return current.priority < previous.priority;
            });
            if (sortedPromos && sortedPromos.length > 0) {
                return sortedPromos[0];
            }
            return undefined;
        }
 
        // Begins promo placement procedure
        this.placePromo = function (storagePromos, installDate) {
            var promo;
            if (storagePromos == null) {
                promo = this.grabPromo([], installDate);
            }
            else {
                promo = this.grabPromo(storagePromos, installDate);
            } 
            if (promo) {
                this.activatePromo(promo.name);
            }
        }

        // Determines if a promo should be shown based on three states: initial / dismissed / completed
        this.shouldShowPromo = function (complete, dismiss, installDate, daysBeforeShowing, daysBeforeShowingIfDismissed) {
            if (!complete && !dismiss) {
                var interval = daysBeforeShowing * 24 * 60 * 60 * 1000;
                return this.hasIntervalPassed(installDate, interval);
            }
            else if (!complete && dismiss) {
                var dismissInterval = daysBeforeShowingIfDismissed * 24 * 60 * 60 * 1000;
                return this.hasIntervalPassed(dismiss, dismissInterval);
            }
            return false;
        }

        // Activates the toggle for a given promo
        this.activatePromo = function (name) {
            if (name === 'twitter') {
                this.twitterPromoEnabled(true);
            }
        }

        // Calculates if a Date object + time interval is in the past
        this.hasIntervalPassed = function (savedTime, interval) {
            var dateObj = new Date(savedTime);
            dateObj.setTime(dateObj.getTime() + interval);
            if (Date.now() > dateObj) {
                return true;
            }
            return false;
        }

        var installDateKey = 'installDate';
        vAPI.storage.get(installDateKey, function (result) {
            if (installDateKey in result && result[installDateKey] !== null) {
                var installDate = result[installDateKey];
                var promoKey = 'promos';
                vAPI.storage.get(promoKey, function (promoResult) {
                    self.placePromo(promoResult[promoKey], installDate);
                });
            }
        });

        this.isToggledText = ko.computed(function () {
            return this.isToggled() ? chrome.i18n.getMessage("on") : chrome.i18n.getMessage("off");
        }, this);
        this.isWhitelistedText = ko.computed(function () {
            return this.isWhitelisted() ? chrome.i18n.getMessage("whitelist") : chrome.i18n.getMessage("blacklist");
        }, this);

        var self = this;
        var blockerBaseURL = "https://www.tunnelbear.com/blocker/info";
        this.pageDetails = ko.observableArray([{
                id: 'ads',
                title: vAPI.i18n("ads"),
                count: self.pageBlockedAdsCount,
                percentage: self.pageBlockedAdsPercentage,
                enabled: self.blockAdsEnabled,
                barClass: 'bar ads',
                url: blockerBaseURL + '#ads',
                onClick: function () {
                    self.blockAdsEnabled(!self.blockAdsEnabled());
                    messager.send('popupPanel', { what: 'toggleBlockAds' });
                    setTimeout(function () {
                        messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                    }, 500);
                }
            }, {
                id: 'flash',
                title: vAPI.i18n("flash"),
                count: self.pageBlockedFlashCount,
                percentage: self.pageBlockedFlashPercentage,
                enabled: self.flashEnabled,
                barClass: 'bar flash',
                url: blockerBaseURL + '#flash',
                onClick: function () {
                    self.flashEnabled(!self.flashEnabled());
                    messager.send('popupPanel', { what: 'toggleFlash' });
                    messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                }
            }, {
                id: 'fingerprinting',
                title: vAPI.i18n("fingerprinting"),
                count: self.pageBlockedFingerprintingCount,
                percentage: self.pageBlockedFingerprintingPercentage,
                enabled: self.browserFingerprintingEnabled,
                barClass: 'bar fingerprinting',
                url: blockerBaseURL + '#fingerprinting',
                onClick: function () {
                    self.browserFingerprintingEnabled(!self.browserFingerprintingEnabled());
                    messager.send('popupPanel', { what: 'toggleBrowserFingerprinting' });
                    messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                }
            }, {
                id: 'email',
                title: vAPI.i18n("email"),
                count: self.pageBlockedEmailCount,
                percentage: self.pageBlockedEmailPercentage,
                enabled: self.blockEmailEnabled,
                barClass: 'bar email',
                url: blockerBaseURL + '#email-tracking',
                onClick: function () {
                    self.blockEmailEnabled(!self.blockEmailEnabled());
                    messager.send('popupPanel', { what: 'toggleBlockEmail' });
                    messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                }
            }, 
            // {
            //     id: 'keyboard',
            //     title: vAPI.i18n("keyboard"),
            //     count: self.pageBlockedKeyboardCount,
            //     percentage: self.pageBlockedKeyboardPercentage,
            //     enabled: self.blockKeyboardEnabled,
            //     barClass: 'bar keyboard',
            //     url: blockerBaseURL + '#mouse-and-keyboard',
            //     onClick: function () {
            //         self.blockKeyboardEnabled(!self.blockKeyboardEnabled());
            //         messager.send('popupPanel', { what: 'toggleBlockKeyboard' });
            //         messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
            //     }
            // }, 
            // {
            //     id: 'mouse',
            //     title: vAPI.i18n("mouse"),
            //     count: self.pageBlockedMouseCount,
            //     percentage: self.pageBlockedMousePercentage,
            //     enabled: self.blockMouseEnabled,
            //     barClass: 'bar mouse',
            //     url: blockerBaseURL + '#mouse-and-keyboard',
            //     onClick: function () {
            //         self.blockMouseEnabled(!self.blockMouseEnabled());
            //         messager.send('popupPanel', { what: 'toggleBlockMouse' });
            //         messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
            //     }
            // }, 
            {
                id: 'microphone',
                title: vAPI.i18n("microphone"),
                count: self.pageBlockedMicrophoneCount,
                percentage: self.pageBlockedMicrophonePercentage,
                enabled: self.blockMicrophoneEnabled,
                barClass: 'bar microphone',
                url: blockerBaseURL + '#ultrasonic-tracking',
                onClick: function () {
                    self.blockMicrophoneEnabled(!self.blockMicrophoneEnabled());
                    messager.send('popupPanel', { what: 'toggleBlockMicrophone' });
                    messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                }
            }, {
                id: 'social',
                title: vAPI.i18n("social"),
                count: self.pageBlockedSocialCount,
                percentage: self.pageBlockedSocialPercentage,
                enabled: self.socialEnabled,
                barClass: 'bar social',
                url: blockerBaseURL + '#soc-buttons',
                onClick: function () {
                    self.socialEnabled(!self.socialEnabled());
                    messager.send('popupPanel', { what: 'toggleSocial' });
                    setTimeout(function () {
                        messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                    }, 500);
                }
            }, {
                id: 'privacy',
                title: vAPI.i18n("privacy"),
                count: self.pageBlockedPrivacyCount,
                percentage: self.pageBlockedPrivacyPercentage,
                enabled: self.privacyEnabled,
                barClass: 'bar privacy',
                url: blockerBaseURL + '#scripts-trackers',
                onClick: function () {
                    self.privacyEnabled(!self.privacyEnabled());
                    messager.send('popupPanel', { what: 'togglePrivacy' });
                    setTimeout(function () {
                        messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                    }, 500);
                }
            }, {
                id: 'malware',
                title: vAPI.i18n("malware"),
                count: self.pageBlockedMalwareCount,
                percentage: self.pageBlockedMalwarePercentage,
                enabled: self.malwareEnabled,
                barClass: 'bar malware',
                url: blockerBaseURL + '#malware',
                onClick: function () {
                    self.malwareEnabled(!self.malwareEnabled());
                    messager.send('popupPanel', { what: 'toggleMalware' });
                    setTimeout(function () {
                        messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
                    }, 500);
                }
            }]);
        this.sortedPageDetails = ko.computed(function () {
            return this.pageDetails().sort(function (left, right) {
                return left.count() == right.count() ? 0 : (left.count() < right.count() ? 1 : -1);
            });
        }, this);

        this.toggle = function () {
            this.isToggled(!this.isToggled());
            messager.send('popupPanel', { what: 'toggleBlockBear', tabId: popupData.tabId });
            messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
        }
        this.toggleWhitelist = function () {
            this.isWhitelisted(!this.isWhitelisted());
            messager.send('popupPanel', { what: 'toggleNetFiltering', url: popupData.pageURL, scope: '', state: this.isWhitelisted(), tabId: popupData.tabId });
            messager.send('popupPanel', { what: 'reloadTab', tabId: popupData.tabId });
        }
        this.toggleShowDetails = function () {
            messager.send('popupPanel', { what: 'toggleShowPopupDetails' });
            this.setDetailsVisibility(!this.isToggleShowDetails());
        }

        this.showReport = function() {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                var tab = tabs[0];
                var manifest = chrome.runtime.getManifest();
                var url = "https://www.tunnelbear.com/blocker/reports?url=" + tab.url + "&version=" + manifest.version;
                chrome.tabs.create({ url: url });
            });
        }
        
        this.setDetailsVisibility = function (visible) {
            if (visible) {
                document.getElementsByClassName('tracker-details')[0].style.display = "block";
                document.getElementsByClassName('count-tracker')[0].style.borderBottomStyle = "solid";
            } else {
                document.getElementsByClassName('tracker-details')[0].style.display = "none";
                document.getElementsByClassName('count-tracker')[0].style.borderBottomStyle = "hidden";
            }
            var self = this;
            setTimeout(function () {
                self.isToggleShowDetails(visible);
                
                self.animateCount(0, self.pageBlockedFlashCount(), 1000, document.getElementById('flash'));
                self.animateCount(0, self.pageBlockedFingerprintingCount(), 1000, document.getElementById('fingerprinting'));
                self.animateCount(0, self.pageBlockedEmailCount(), 1000, document.getElementById('email'));
                // self.animateCount(0, self.pageBlockedKeyboardCount(), 1000, document.getElementById('keyboard'));
                // self.animateCount(0, self.pageBlockedMouseCount(), 1000, document.getElementById('mouse'));
                self.animateCount(0, self.pageBlockedMicrophoneCount(), 1000, document.getElementById('microphone'));
                self.animateCount(0, self.pageBlockedAdsCount(), 1000, document.getElementById('ads'));
                self.animateCount(0, self.pageBlockedSocialCount(), 1000, document.getElementById('social'));
                self.animateCount(0, self.pageBlockedPrivacyCount(), 1000, document.getElementById('privacy'));
                self.animateCount(0, self.pageBlockedMalwareCount(), 1000, document.getElementById('malware'));
            }, 100);  
        }

        this.openSettings = function () {
            chrome.tabs.create({ url: "settings.html" });
        }

        this.createTab = function (item) {
            console.log(item);
            chrome.tabs.create({ url: item.url });
        }

        this.writePromoToStorage = function (promoName, element, value) {
            var promosKey = 'promos';
            var storageDataFound = false;
            vAPI.storage.get(promosKey, function (result) {
                storageDataFound = promosKey in result ? true : false;
                if (storageDataFound) {
                    var data = result.promos;
                    for (var promo in data) {
                        if (data[promo].name === promoName) {
                            data[promo][element] = value;
                            vAPI.storage.set({
                                promos: data
                            });
                        }
                    }
                }
                else {
                    var record = {
                        name: promoName
                    };
                    record[element] = value;
                    var data = [record];
                    vAPI.storage.set({
                        promos: data
                    });
                }
            });
        }

        this.tweetNow = function () {
            var twitterHeader = "https://twitter.com/intent/tweet?text=";
            var twitterText = "Check out TunnelBear Blocker!";
            var storeURL = "https://chrome.google.com/webstore/detail/tunnelbear-blocker/bebdhgdigjiiamnkcenegafmfjoghafk";
            var twitterCompleteDate = new Date();
            self.writePromoToStorage('twitter', completeKey, twitterCompleteDate.toString());
            chrome.tabs.create( { url: twitterHeader + twitterText + ' ' + storeURL });
        }

        this.dismissTwitterPromo = function () {
            var twitterDismissDate = new Date();
            self.writePromoToStorage('twitter', dismissKey, twitterDismissDate.toString());
            self.twitterPromoEnabled(false);
        }

        this.watchContentChanged = function () {
            var self = this;
            setTimeout(function () {
                getPopupData(function (resp) {
                    var start = self.pageBlockedCount();
                    
                    self.pageBlockedRequestCount(resp.pageBlockedRequestCount);
                    
                    var startFlashCount = self.pageBlockedFlashCount();
                    if (startFlashCount != resp.pageBlockedFlashCount) {
                        self.pageBlockedFlashCount(resp.pageBlockedFlashCount);
                        self.animateCount(startFlashCount, resp.pageBlockedFlashCount, 1000, document.getElementById('flash'));
                    }
                    
                    var startFingerprintingCount = self.pageBlockedFingerprintingCount();
                    if (startFingerprintingCount != resp.pageBlockedFingerprintingCount) {
                        self.pageBlockedFingerprintingCount(resp.pageBlockedFingerprintingCount);
                        self.animateCount(startFingerprintingCount, resp.pageBlockedFingerprintingCount, 1000, document.getElementById('fingerprinting'));
                    }

                    var startEmailCount = self.pageBlockedEmailCount();
                    if (startEmailCount != resp.pageBlockedEmailCount) {
                        self.pageBlockedEmailCount(resp.pageBlockedEmailCount);
                        self.animateCount(startEmailCount, resp.pageBlockedEmailCount, 1000, document.getElementById('email'));
                    }

                    var startKeyboardCount = self.pageBlockedKeyboardCount();
                    if (startKeyboardCount != resp.pageBlockedKeyboardCount) {
                        self.pageBlockedKeyboardCount(resp.pageBlockedKeyboardCount);
                        self.animateCount(startKeyboardCount, resp.pageBlockedKeyboardCount, 1000, document.getElementById('keyboard'));
                    }

                    var startMouseCount = self.pageBlockedMouseCount();
                    if (startMouseCount != resp.pageBlockedMouseCount) {
                        self.pageBlockedMouseCount(resp.pageBlockedMouseCount);
                        self.animateCount(startMouseCount, resp.pageBlockedMouseCount, 1000, document.getElementById('mouse'));
                    }

                    var startMicrophoneCount = self.pageBlockedMicrophoneCount();
                    if (startMicrophoneCount != resp.pageBlockedMicrophoneCount) {
                        self.pageBlockedMicrophoneCount(resp.pageBlockedMicrophoneCount);
                        self.animateCount(startMicrophoneCount, resp.pageBlockedMicrophoneCount, 1000, document.getElementById('microphone'));
                    }
                    
                    var startAdsCount = self.pageBlockedAdsCount();
                    if (startAdsCount != resp.pageBlockedAdsCount) {
                        self.pageBlockedAdsCount(resp.pageBlockedAdsCount);
                        self.animateCount(startAdsCount, resp.pageBlockedAdsCount, 1000, document.getElementById('ads'));
                    }
                    
                    var startSocialCount = self.pageBlockedSocialCount();
                    if (startSocialCount != resp.pageBlockedSocialCount) {
                        self.pageBlockedSocialCount(resp.pageBlockedSocialCount);
                        self.animateCount(startSocialCount, resp.pageBlockedSocialCount, 1000, document.getElementById('social'));
                    }
                    
                    var startPrivacyCount = self.pageBlockedPrivacyCount();
                    if (startPrivacyCount != resp.pageBlockedPrivacyCount) {
                        self.pageBlockedPrivacyCount(resp.pageBlockedPrivacyCount);
                        self.animateCount(startPrivacyCount, resp.pageBlockedPrivacyCount, 1000, document.getElementById('privacy'));
                    }
                    
                    var startMalwareCount = self.pageBlockedMalwareCount();
                    if (startMalwareCount != resp.pageBlockedMalwareCount) {
                        self.pageBlockedMalwareCount(resp.pageBlockedMalwareCount);
                        self.animateCount(startMalwareCount, resp.pageBlockedMalwareCount, 1000, document.getElementById('malware'));
                    }
                    
                    var end = self.pageBlockedCount();
                    
                    if (start != end) {
                        self.animateCount(start, end, 1000, document.getElementById('pageBlockedCount'));
                    }
                });
                self.watchContentChanged();
            }, 1500);
        }
        
        this.animateCount = function (start, end, duration, obj) {
            var range = end - start;
            var minTimer = 50;
            var stepTime = Math.abs(Math.floor(duration / range));
            stepTime = Math.max(stepTime, minTimer);
            var startTime = new Date().getTime();
            var endTime = startTime + duration;
            var timer;
        
            function run() {
                var now = new Date().getTime();
                var remaining = Math.max((endTime - now) / duration, 0);
                var value = Math.round(end - (remaining * range));
                obj.innerHTML = value;
                if (value == end) {
                    clearInterval(timer);
                }
            }
            
            timer = setInterval(run, stepTime);
            run();
        };
        
        this.animateCount(0, this.pageBlockedCount(), 1000, document.getElementById('pageBlockedCount'));
        this.watchContentChanged();
        if (window.devicePixelRatio > 1) {
            var images = document.getElementsByTagName('img');
            for (var index = 0; index < images.length; index++) {
                var src = images[index].src;
                if(src && src.indexOf("2x.") == -1) {
                    images[index].src = src.replace(".png", "2x.png");
                }   
            }
        }
        var self = this;
        setTimeout(function() {
            self.setDetailsVisibility(self.isToggleShowDetails());
        }, 100);
    };

    uDom.onLoad(function () {
        getPopupData(function (response) {
            ko.applyBindings(new PopupViewModel(response));
        });
    });

})();
