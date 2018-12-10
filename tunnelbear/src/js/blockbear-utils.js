(function () {

if (!vAPI) {
  return;
}
vAPI.utils = {
  getIconUrl: function (icon) {
    var suffix = ".png";
    if (window.devicePixelRatio.isRetina) {
      suffix = "2x.png";
    }
    return "../img/" + icon + suffix;
  }
};

})();