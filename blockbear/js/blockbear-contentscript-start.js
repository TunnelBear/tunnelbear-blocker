(function () {
    if (!vAPI) {
        return;
    }

    var messager = vAPI.messaging.channel('blockbear-contentscript-start.js');

    var notifications = [];
    window.addEventListener('message', function (event) {
        if (event && event.data && event.data.source == 'blockbear') {
            switch (event.data.message) {
                case 'restore-fingerprinting':
                    messager.send({ what: 'clearFingerprintingCount' });
                    break;
                case 'restore-keyboard':
                    messager.send({ what: 'clearKeyboardCount' });
                    break;
                case 'keyboard':
                    messager.send({ what: 'incrementKeyboardCount', message: event.data.message, data: event.data.data });
                    break;
                case 'restore-mouse':
                    messager.send({ what: 'clearMouseCount' });
                    break;
                case 'mouse':
                    messager.send({ what: 'incrementMouseCount', message: event.data.message, data: event.data.data });
                    break;
                case 'restore-microphone':
                    messager.send({ what: 'clearMicrophoneCount' });
                    break;
                case 'microphone':
                    messager.send({ what: 'incrementMicrophoneCount', message: event.data.message, data: event.data.data });
                    break;
                default:
                    if (notifications.indexOf(event.data.message) == -1) {
                        console.log(event.data.message);
                        notifications.push(event.data.message);
                        messager.send({ what: 'incrementFingerprintingCount', message: event.data.message, data: event.data.data });
                    }
                    break;
            }
        }
    });

    var api = function (blockFingerprinting, blockMicrophone, blockKeyboard, blockMouse, blockBlockAdBlock) {

        // block BlockAdBlock
        if (blockBlockAdBlock) {
            (function (window) {
                var debug = false;

                var FuckAdBlock = function (options) {
                    if (options !== undefined)
                        this.setOption(options);

                    var self = this;
                    window.addEventListener('load', function () {
                        setTimeout(function () {
                            if (self._options.checkOnLoad === true)
                                self.check(false);
                        }, 1);
                    }, false);

                    // hotfix
                    var self = this;
                    this.debug = {
                        set: function (x) { debug = !!x; return self; },
                        get: function () { return debug; }
                    }
                }

                FuckAdBlock.prototype = {
                    setOption: function (options, value) {
                        if (value !== undefined) {
                            var key = options;
                            options = {};
                            options[key] = value;
                        }

                        for (option in options)
                            this._options[option] = options[option];

                        return this;
                    },

                    _options: {
                        checkOnLoad: true,
                        resetOnEnd: true,
                    },

                    _var: {
                        triggers: []
                    },

                    check: function (ignore) {
                        this.emitEvent(false);
                        return true;
                    },

                    clearEvent: function () {
                        this._var.triggers = [];
                    },

                    emitEvent: function (detected) {
                        if (detected === false) {
                            var fns = this._var.triggers;
                            for (i in fns)
                                fns[i]();

                            if (this._options.resetOnEnd === true)
                                this.clearEvent();
                        }
                        return this;
                    },

                    on: function (detected, fn) {
                        if (detected === false)
                            this._var.triggers.push(fn);
                        return this;
                    },

                    onDetected: function (fn) {
                        window.top.postMessage({ message: 'blockAdBlock', source: 'blockbear' }, '*');
                        return this;
                    },

                    onNotDetected: function (fn) {
                        return this.on(false, fn);
                    }
                };

                var fuck = new FuckAdBlock();
                for (var field in fuck) {
                    Object.defineProperty(fuck, field, { value: fuck[field], configurable: false });
                }
                Object.defineProperties(window, { fuckAdBlock: { value: fuck, enumerable: true, writable: false, configurable: true } });
                Object.defineProperties(window, { blockAdBlock: { value: fuck, enumerable: true, writable: false, configurable: true } });
            })(window);
        }
        var defProperty = Object.defineProperty;
        var setApi = function (obj, property, isBlocked, fake, setter) {
            try {
                if (!obj[property + "_BACKUP"]) {
                    obj[property + "_BACKUP"] = obj[property];
                }
                defProperty(obj, property, {
                    enumerable: true,
                    configureable: false,
                    get: function () {
                        if (isBlocked()) {
                            return fake();
                        } else {
                            return obj[property + "_BACKUP"];
                        }
                    },
                    set: setter
                });
            } catch (e) {
                // console.log(e);
            }
        }

        Object.defineProperty = function (o, p, attributes) {
            return defProperty(o, p, attributes);
        }

        if (blockMicrophone) {
            if (!window.blockMicrophone) {
                window.blockMicrophone = true;
                if (AudioContext) {
                    setApi(window, "AudioContext", function () { return window.blockMicrophone }, function () {
                        return function () {
                            window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                        };
                    });
                }
                if (webkitAudioContext) {
                    setApi(window, "webkitAudioContext", function () { return window.blockMicrophone }, function () {
                        return function () {
                            window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                        };
                    });
                }
                if (window.MediaStreamTrack) {
                    setApi(window, "MediaStreamTrack", function () { return window.blockMicrophone }, function () {
                        return function () {
                            window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                        };
                    });
                }
                if (navigator) {
                    setApi(navigator, "getUserMedia", function () { return window.blockMicrophone }, function () {
                        return function (e, successCallback, errorCallback) {
                            if (e.audio) {
                                window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                            }
                            else {
                                navigator["getUserMedia_BACKUP"](e, successCallback, errorCallback);
                            }
                        };
                    });
                    setApi(navigator, "webkitGetUserMedia", function () { return window.blockMicrophone }, function () {
                        return function (e, successCallback, errorCallback) {
                            if (e.audio) {
                                window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                            } else {
                                navigator["webkitGetUserMedia_BACKUP"](e, successCallback, errorCallback)
                            }
                        };
                    });
                    setApi(navigator, "mediaDevices", function () { return window.blockMicrophone }, function () {
                        return function () {
                            window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
                        };
                    });
                }
            }
        } else {
            window.blockMicrophone = false;
            window.top.postMessage({ message: 'restore-microphone', source: 'blockbear' }, '*');
        }

        // https://www.keytrac.net/en/tryout/authenticate
        // if (blockKeyboard) {
        //     if (!window.blockKeyboard) {
        //         window.blockKeyboard = true;
        //         console.log('block keyboard');

        //         var keyboardNotification = false;
        //         function sleepRand(min, max) {
        //             var now = new Date().getTime();
        //             var rand = Math.random() * (max - min) + min;
        //             var end = now + rand;
        //             console.log('RAND = ' + rand);
        //             while (new Date().getTime() < end) { }
        //         }
        //         var addEventListener = function () {
        //             var sleepMin = 10;
        //             var sleepMax = 20;
        //             return function () {
        //                 var args = arguments;
        //                 // if (args[0] == "keydown") {
        //                 //     console.log('block keydown');
        //                 //     return this["addEventListener_BACKUP"](args[0], function (e) {
        //                 //         console.log('keydown...')
        //                 //         var shouldSleep = Math.round(Math.random()) < 0.5 ? sleepRand(sleepMin, sleepMax) : false;
        //                 //         args[1](e);
        //                 //     }, args[2]);
        //                 // }
        //                 if (args[0] == "keyup") {
        //                     console.log('block keyup');
        //                     return this["addEventListener_BACKUP"](args[0], function (e) {
        //                         console.log('keyup...')
        //                         if (!keyboardNotification) {
        //                             keyboardNotification = true;
        //                             window.top.postMessage({ message: 'keyboard', source: 'blockbear' }, '*');
        //                         }
        //                         var shouldSleep = Math.round(Math.random()) < 0.8 ? sleepRand(sleepMin, sleepMax) : false;
        //                         args[1](e);
        //                     }, args[2]);
        //                 }
        //                 return this["addEventListener_BACKUP"](args[0], args[1], args[2]);
        //             };
        //         }
        //         setApi(HTMLInputElement.prototype, "addEventListener", function () { return window.blockKeyboard }, addEventListener);



                // var addEventListener = function () {
                //     return function () {
                //         var self = this;
                //         var args = arguments;
                //         var fakeKeyboard = function () {
                //             if (self.keydownListening && self.keyupListening) {
                //                 var rand = Math.round(Math.random() * 50) + 1;
                //                 setTimeout(function () {
                //                     var e = document.createEvent('HTMLEvents');
                //                     e.initEvent("keyup", true, true);
                //                     self.dispatchEvent(e)
                //                     fakeKeyboard();
                //                 }, rand);
                //             }
                //         }

                //         if (args[0] == "keydown") {
                //             console.log('fake keydown');
                //             self.keydownListening = true;
                //             window.top.postMessage({ message: 'keyboard', source: 'blockbear' }, '*');
                //             return self["addEventListener_BACKUP"](args[0], function (e) {
                //                 args[1](e);
                //             }, args[2]);
                //         }
                //         if (args[0] == "keyup") {
                //             console.log('fake keyup');
                //             self.keyupListening = true;
                //             window.top.postMessage({ message: 'keyboard', source: 'blockbear' }, '*');
                //             return self["addEventListener_BACKUP"](args[0], function (e) {
                //                 args[1](e);
                //             }, args[2]);
                //         }
                //         fakeKeyboard();

                //         return self["addEventListener_BACKUP"](args[0], args[1], args[2]);
                //     };
                // }
                // setApi(HTMLInputElement.prototype, "addEventListener", function () { return window.blockKeyboard }, addEventListener);
        //     }
        // } else {
        //     window.blockKeyboard = false;
        //     window.top.postMessage({ message: 'restore-keyboard', source: 'blockbear' }, '*');
        // }

        // if (blockMouse) {
        //     if (!window.blockMouse) {
        //         window.blockMouse = true;
        //         console.log('block mouse');
        //         var isMousedown = false;
        //         var wheelNotification = false;
        //         var mouseMoveNotification = false;
        //         function sleepRand(min, max) {
        //             var now = new Date().getTime();
        //             var rand = Math.random() * (max - min) + min;
        //             var end = now + rand;
        //             console.log('RAND = ' + rand);
        //             while (new Date().getTime() < end) { }
        //         }
        //         var addEventListener = function () {
        //             var sleepMin = 1;
        //             var sleepMax = 10;
        //             return function () {
        //                 var args = arguments;
        //                 if (args[0] == "wheel") {
        //                     console.log('listen wheel');
        //                     return this["addEventListener_BACKUP"](args[0], function (e) {
        //                         if (!wheelNotification) {
        //                             wheelNotification = true;
        //                             window.top.postMessage({ message: 'mouse', source: 'blockbear' }, '*');
        //                         }
        //                         var shouldSleep = Math.round(Math.random()) < 0.8 ? sleepRand(sleepMin, sleepMax) : false;
        //                         args[1](e);
        //                     }, args[2]);
        //                 }

        //                 if (args[0] == 'mousemove') {
        //                     return this["addEventListener_BACKUP"](args[0], function (e) {
        //                         console.log('mousemove');
        //                         if (!mouseMoveNotification) {
        //                             mouseMoveNotification = true;
        //                             window.top.postMessage({ message: 'mouse', source: 'blockbear' }, '*');
        //                         }
        //                         var shouldSleep = Math.round(Math.random()) < 0.5 ? sleepRand(sleepMin, sleepMax) : false;
        //                         args[1](e);
        //                     });
        //                 }


                        // [BUG] Google Calendar
                        // if (args[0] == "mousemove") {
                        //     console.log('listen mousemove');
                        //     this.addEventListener("mousedown", function (event) {
                        //         console.log('mousedown');
                        //         isMousedown = true;
                        //     });
                        //     this.addEventListener("click", function (event) {
                        //         console.log('click');
                        //         isMousedown = true;
                        //     });
                        //     this.addEventListener("mouseup", function (event) {
                        //         console.log('mouseup');
                        //         isMousedown = false;
                        //     });
                        //     return this["addEventListener_BACKUP"](args[0], function (e) {
                        //         if (!mouseMoveNotification) {
                        //             mouseMoveNotification = true;
                        //             window.top.postMessage({ message: 'mouse', source: 'blockbear' }, '*');
                        //         }
                        //         setTimeout(function() {
                        //             if (isMousedown) {
                        //                 console.log('drag&drop');
                        //                 args[1](e);
                        //             } else {
                        //                 console.log('mousemove');
                        //                 args[1](new Event(e.type));
                        //             }
                        //         }, 10);
                        //     }, args[2]);
                        // }
        //                 return this["addEventListener_BACKUP"](args[0], args[1], args[2]);
        //             };
        //         }
        //         setApi(Element.prototype, "addEventListener", function () { return window.blockMouse }, addEventListener);
        //         setApi(HTMLDocument.prototype, "addEventListener", function () { return window.blockMouse }, addEventListener);
        //         setApi(Window.prototype, "addEventListener", function () { return window.blockMouse }, addEventListener);
        //     }
        // } else {
        //     window.blockMouse = false;
        //     window.top.postMessage({ message: 'restore-mouse', source: 'blockbear' }, '*');
        // }

        // http://jcarlosnorte.com/security/2016/03/06/advanced-tor-browser-fingerprinting.html
        // https://panopticlick.eff.org/
        if (!blockFingerprinting) {
            window.blockBrowserFingerprinting = false;
            window.top.postMessage({ message: 'restore-fingerprinting', source: 'blockbear' }, '*');
        } else {
            if (!window.blockBrowserFingerprinting) {
                window.blockBrowserFingerprinting = true;
                if (!HTMLCanvasElement.prototype.modified) {
                    HTMLCanvasElement.prototype.modified = true;
                    setApi(HTMLCanvasElement.prototype, "toDataURL", function () { return window.blockBrowserFingerprinting }, function () {
                        return function () {
                            var data = this["toDataURL_BACKUP"](arguments);
                            if (this.parentNode) {
                                var img = document.createElement("img");
                                img.src = data;
                                this.parentNode.appendChild(img);
                            }
                            window.top.postMessage({ message: 'canvas.toDataURL', source: 'blockbear', data: data }, '*');
                            return "";
                        };
                    });
                    setApi(HTMLCanvasElement.prototype, "getContext", function () { return window.blockBrowserFingerprinting }, function () {
                        return function (ctx, attr) {
                            console.log('getContext ' + ctx);
                            console.log('attributes ' + attr);
                            if (ctx == "experimental-webgl" || ctx == "webgl") {
                                window.top.postMessage({ message: 'canvas.getContext', source: 'blockbear', data: data }, '*');
                            } else {
                                if (attr) {
                                    return this["getContext_BACKUP"](ctx, attr);
                                } else {
                                    return this["getContext_BACKUP"](ctx);
                                }
                            }
                        };
                    });
                }
                if (!Element.prototype.modified) {
                    Element.prototype.modified = true;
                    setApi(Element.prototype, "getClientRects", function () { return window.blockBrowserFingerprinting }, function () {
                        return function () {
                            window.top.postMessage({ message: 'element.getClientRects', source: 'blockbear' }, '*');
                            return [];
                        }
                    });
                    setApi(CSSStyleDeclaration.prototype, "fontFamily", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'CSSStyleDeclaration.fontFamily', source: 'blockbear' }, '*');
                    }, function (val) {
                        window.top.postMessage({ message: 'CSSStyleDeclaration.fontFamily', source: 'blockbear' }, '*');
                    });
                }
                if (!screen.modified) {
                    screen.modified = true;
                    setApi(screen, "colorDepth", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'screen.colorDepth', source: 'blockbear' }, '*');
                        return 24;
                    });
                    setApi(screen, "width", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'screen.width', source: 'blockbear' }, '*');
                        return 1000;
                    });
                    setApi(screen, "height", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'screen.height', source: 'blockbear' }, '*');
                        return 700;
                    });
                }
                // if (!Date.prototype.modified) {
                // 	Date.prototype.modified = true;
                // 	setApi(Date.prototype, "getTimezoneOffset", function() { return window.blockBrowserFingerprinting }, function () {
                // 		window.top.postMessage({ message: 'date.getTimezoneOffset', source: 'blockbear' }, '*');
                // 		return function () { return 0 };
                // 	});
                // }
                if (!navigator.modified) {
                    navigator.modified = true;
                    setApi(navigator, "plugins", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'navigator.plugins', source: 'blockbear' }, '*');
                        var flash = navigator["plugins_BACKUP"]["Shockwave Flash"];
                        if (flash) {
                            return {
                                length: 1,
                                refresh: function () { },
                                0: flash,
                                "Shockwave Flash": flash
                            };
                        } else {
                            return { length: 0, refresh: function () { } };
                        }
                    });
                    setApi(navigator, "mimeTypes", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'navigator.mimeTypes', source: 'blockbear' }, '*');
                        var flash = navigator["plugins_BACKUP"]["Shockwave Flash"];
                        if (flash) {
                            var result = {
                                length: 2
                            };
                            result[0] = flash[0];
                            result[flash[0].type] = flash[0];
                            result[1] = flash[1];
                            result[flash[1].type] = flash[1];
                            return result;
                        } else {
                            return { length: 0 };
                        }
                    });
                    setApi(navigator, "getBattery", function () { return window.blockBrowserFingerprinting }, function () {
                        return function () {
                            window.top.postMessage({ message: 'navigator.getBattery', source: 'blockbear' }, '*');
                            return 0;
                        }
                    });
                    setApi(navigator, "hardwareConcurrency", function () { return window.blockBrowserFingerprinting }, function () {
                        window.top.postMessage({ message: 'navigator.hardwareConcurrency', source: 'blockbear' }, '*');
                        return 0;
                    });
                    // setApi(navigator, "appCodeName", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.appCodeName', source: 'blockbear' }, '*');
                    // 	return "Mozilla";
                    // });
                    // setApi(navigator, "appName", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.appName', source: 'blockbear' }, '*');
                    // 	return "Netscape";
                    // });
                    // FIX CHROME NEW TAB
                    // setApi(navigator, "appVersion", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.appVersion', source: 'blockbear' }, '*');
                    // 	return "5.0 (Windows)";
                    // });
                    // setApi(navigator, "buildID", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.buildID', source: 'blockbear' }, '*');
                    // 	return "20100101";
                    // });
                    // setApi(navigator, "javaEnabled", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.javaEnabled', source: 'blockbear' }, '*');
                    // 	return function () { return false };
                    // });
                    // setApi(navigator, "language", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.language', source: 'blockbear' }, '*');
                    // 	return "en-US";
                    // });
                    // setApi(navigator, "languages", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.languages', source: 'blockbear' }, '*');
                    // 	return ["en-US", "en"];
                    // });
                    // setApi(navigator, "platform", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.platform', source: 'blockbear' }, '*');
                    // 	return "win32";
                    // });
                    // setApi(navigator, "product", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.product', source: 'blockbear' }, '*');
                    // 	return "Gecko";
                    // });
                    // setApi(navigator, "productSub", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.productSub', source: 'blockbear' }, '*');
                    // 	return "20100101";
                    // });
                    // FIX YOUTUBE FULLSCREEN
                    // setApi(navigator, "userAgent", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.userAgent', source: 'blockbear' }, '*');
                    // 	return "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36";
                    // });
                    // setApi(navigator, "vendor", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.vendor', source: 'blockbear' }, '*');
                    // 	return "";
                    // });
                    // setApi(navigator, "vendorSub", function() { return window.blockBrowserFingerprinting }, function () {
                    // 	window.top.postMessage({ message: 'navigator.vendorSub', source: 'blockbear' }, '*');
                    // 	return "";
                    // });
                }
            }
        }
    };

    var watcher = "(" + function (api, blockFingerprinting, blockMicrophone, blockKeyboard, blockMouse, blockBlockAdBlock) {
        var observer = new MutationObserver(function (mutations) {
            var iframes = document.getElementsByTagName("iframe");
            if (iframes.length > 0) {
                for (var index = 0; index < iframes.length; index++) {
                    var iframe = iframes[index];
                    try {
                        iframe.contentWindow.init = function (api) {
                            this.window.eval("(" + api + ")(" + blockFingerprinting + ", " + blockMicrophone + ", " + blockKeyboard + ", " + blockMouse + ", " + blockBlockAdBlock + ");");
                        }
                        iframe.contentWindow.init(api);
                    } catch (e) {
                        console.log(e);
                    }
                }
            }
        });
        observer.observe(this.document, { childList: true, subtree: true });
        if (blockFingerprinting) {
            this.document.blockCanvasObserver = observer;
        } else {
            if (this.document.blockCanvasObserver) {
                this.document.blockCanvasObserver.disconnect();
            }
        }
    } + ")";

    var reset = function (blockFingerprinting, blockMicrophone, blockKeyboard, blockMouse, blockBlockAdBlock) {
        this.document.documentElement.setAttribute("onreset", "(" + api + ")(" + blockFingerprinting + ", " + blockMicrophone + ", " + blockKeyboard + ", " + blockMouse + ", " + blockBlockAdBlock + ");" + watcher + "(" + api + ", " + blockFingerprinting + ", " + blockMicrophone + ", " + blockKeyboard + ", " + blockMouse + ", " + blockBlockAdBlock + ");");
        this.document.documentElement.dispatchEvent(new CustomEvent("reset"));
        this.document.documentElement.removeAttribute("onreset");
    }

    messager.send({
        what: 'blockBrowserFingerprinting'
    }, function (response) {
        reset(response.blockFingerprinting, response.blockMicrophone, response.blockKeyboard, response.blockMouse, response.blockBlockAdBlock);
    });
    reset(true, true, true, true, false);
})();