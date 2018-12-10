(function () {

if (typeof vAPI === 'undefined' || !vAPI) {
  return;
}

var messager = vAPI.messaging;
messager.addChannelListener('blockbear-contentscript-start.js');
var notifications = [];
window.addEventListener('message', function (event) {
  if (event && event.data && event.data.source == 'blockbear') {
    switch (event.data.message) {
      case 'restore-fingerprinting':
        messager.send('blockbear-contentscript-start.js', { what: 'clearFingerprintingCount' });
        break;
      case 'restore-keyboard':
        messager.send('blockbear-contentscript-start.js', { what: 'clearKeyboardCount' });
        break;
      case 'keyboard':
        messager.send('blockbear-contentscript-start.js', { what: 'incrementKeyboardCount', message: event.data.message, data: event.data.data });
        break;
      case 'restore-mouse':
        messager.send('blockbear-contentscript-start.js', { what: 'clearMouseCount' });
        break;
      case 'mouse':
        messager.send('blockbear-contentscript-start.js', { what: 'incrementMouseCount', message: event.data.message, data: event.data.data });
        break;
      case 'restore-microphone':
        messager.send('blockbear-contentscript-start.js', { what: 'clearMicrophoneCount' });
        break;
      case 'microphone':
        messager.send('blockbear-contentscript-start.js', { what: 'incrementMicrophoneCount', message: event.data.message, data: event.data.data });
        break;
      default:
        if (notifications.indexOf(event.data.message) == -1) {
          console.log(event.data.message);
          notifications.push(event.data.message);
          messager.send('blockbear-contentscript-start.js', { what: 'incrementFingerprintingCount', message: event.data.message, data: event.data.data });
        }
        break;
    }
  }
});

var reset = function (blockMicrophone) {
  let browserObj = navigator.userAgent.indexOf("Firefox") ? browser : chrome;
  let script = this.document.createElement("script");
  script.dataset.blockMicrophone = blockMicrophone;
  script.src = browserObj.runtime.getURL("js/blockbear-contentscript-inject.js");
  script.onload = function() {
    this.remove();
  };
  (this.document.head || this.document.documentElement).appendChild(script);
}

messager.send('blockbear-contentscript-start.js', {
  what: 'blockBrowserFingerprinting'
}, function (response) {
  reset(response.blockMicrophone);
});

})();
