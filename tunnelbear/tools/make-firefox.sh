echo "//========================================================//"
echo "//    Fetching uAssets                                    //"
echo "//========================================================//"
pushd uAssets > /dev/null
git pull origin master
popd > /dev/null

echo "//========================================================//"
echo "//    Building uBlock Origin                              //"
echo "//========================================================//"
pushd uBlock > /dev/null
bash tools/make-firefox.sh
popd > /dev/null

echo "//========================================================//"
echo "//    Adding TunnelBear Blocker Files                     //"
echo "//========================================================//"
mkdir -p tunnelbear/dist/blockbear.firefox
rm -rf tunnelbear/dist/blockbear.firefox/*
mv -v uBlock/dist/build/uBlock0.firefox/* tunnelbear/dist/blockbear.firefox

# CSS files
rm tunnelbear/dist/blockbear.firefox/css/*.css
cp tunnelbear/src/css/* tunnelbear/dist/blockbear.firefox/css

# Font files
rm tunnelbear/dist/blockbear.firefox/css/fonts/*
cp tunnelbear/resources/fonts/* tunnelbear/dist/blockbear.firefox/css/fonts

# # Image files
rm -rf tunnelbear/dist/blockbear.firefox/img
cp -R tunnelbear/resources/img tunnelbear/dist/blockbear.firefox/img

# # Manifest file
cp tunnelbear/resources/manifest.json tunnelbear/dist/blockbear.firefox/manifest.json

# # JS files
cp tunnelbear/src/js/* tunnelbear/dist/blockbear.firefox/js

# # HTML files
mv tunnelbear/dist/blockbear.firefox/is-webrtc-supported.html tunnelbear/dist/blockbear.firefox/is-webrtc-supported.html.keep
rm tunnelbear/dist/blockbear.firefox/*.html
cp tunnelbear/src/html/* tunnelbear/dist/blockbear.firefox
mv tunnelbear/dist/blockbear.firefox/is-webrtc-supported.html.keep tunnelbear/dist/blockbear.firefox/is-webrtc-supported.html

# # Localization files
rm -rf rm tunnelbear/dist/blockbear.firefox/_locales/*
cp -R tunnelbear/src/_locales/* tunnelbear/dist/blockbear.firefox/_locales

# # tko js library
cp node_modules/tko/dist/tko.js tunnelbear/dist/blockbear.firefox/js

# # Remove unnecessary js files
rm tunnelbear/dist/blockbear.firefox/js/popup.js
rm tunnelbear/dist/blockbear.firefox/js/settings.js
