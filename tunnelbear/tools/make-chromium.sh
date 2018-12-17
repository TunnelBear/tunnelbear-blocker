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
bash tools/make-chromium.sh
popd > /dev/null

echo "//========================================================//"
echo "//    Adding TunnelBear Blocker Files                     //"
echo "//========================================================//"
mkdir -p tunnelbear/dist/blockbear.chromium
rm -rf tunnelbear/dist/blockbear.chromium/*
mv -v uBlock/dist/build/uBlock0.chromium/* tunnelbear/dist/blockbear.chromium

# CSS files
rm tunnelbear/dist/blockbear.chromium/css/*.css
cp tunnelbear/src/css/* tunnelbear/dist/blockbear.chromium/css

# Font files
rm tunnelbear/dist/blockbear.chromium/css/fonts/*
cp tunnelbear/resources/fonts/* tunnelbear/dist/blockbear.chromium/css/fonts

# # Image files
rm -rf tunnelbear/dist/blockbear.chromium/img
cp -R tunnelbear/resources/img tunnelbear/dist/blockbear.chromium/img

# # Manifest file
cp tunnelbear/resources/manifest.json tunnelbear/dist/blockbear.chromium/manifest.json

# # JS files
cp tunnelbear/src/js/* tunnelbear/dist/blockbear.chromium/js

# # HTML files
mv tunnelbear/dist/blockbear.chromium/is-webrtc-supported.html tunnelbear/dist/blockbear.chromium/is-webrtc-supported.html.keep
rm tunnelbear/dist/blockbear.chromium/*.html
cp tunnelbear/src/html/* tunnelbear/dist/blockbear.chromium
mv tunnelbear/dist/blockbear.chromium/is-webrtc-supported.html.keep tunnelbear/dist/blockbear.chromium/is-webrtc-supported.html

# # Localization files
rm -rf rm tunnelbear/dist/blockbear.chromium/_locales/*
cp -R tunnelbear/src/_locales/* tunnelbear/dist/blockbear.chromium/_locales

# # tko js library
cp node_modules/tko/dist/tko.js tunnelbear/dist/blockbear.chromium/js

# # Remove unnecessary js files
rm tunnelbear/dist/blockbear.chromium/js/popup.js
rm tunnelbear/dist/blockbear.chromium/js/settings.js
