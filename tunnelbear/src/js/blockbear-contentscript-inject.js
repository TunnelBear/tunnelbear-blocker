(function () {
  let blockMicrophone = document.currentScript.dataset.blockMicrophone === "true";

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

  // https://audiofingerprint.openwpm.com/
  if (blockMicrophone === true) {
    if (!window.blockMicrophone) {
      window.blockMicrophone = true;
      if (AudioContext) {
        setApi(window, "AudioContext", function () { return window.blockMicrophone }, function () {
          return function () {
            window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
          };
        }, function (audioContext) { });
      }
      if (window.webkitAudioContext) {
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
        }, function (val) {
          window.top.postMessage({ message: 'microphone', source: 'blockbear' }, '*');
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
})();