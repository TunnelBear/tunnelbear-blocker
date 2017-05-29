#!/bin/bash
#
# This script assumes a linux environment

echo "*** blockbear.chromium: Creating web store package"
echo "*** blockbear.chromium: Copying files"

if [ "$1" = experimental ]; then
    DES=dist/build/experimental/blockbear.chromium
else
    DES=dist/build/blockbear.chromium
fi
rm -rf $DES
mkdir -p $DES

echo "*** blockbear.chromium: bower install..."
bower install
echo "*** blockbear.chromium: npm install..."
npm install

bash ./tools/make-assets.sh $DES

cp -R src/css               $DES/
cp -R src/img               $DES/
cp -R src/js                $DES/
cp -R src/lib               $DES/
cp -R src/_locales          $DES/
cp src/*.html               $DES/
cp platform/chromium/*.js   $DES/js/
cp -R platform/chromium/img $DES/
cp platform/chromium/*.html $DES/
cp platform/chromium/*.json $DES/
cp LICENSE.txt              $DES/

cp bower_components/knockout/dist/knockout.js $DES/js
cp node_modules/moment/min/moment.min.js $DES/js

if [ "$1" = all ]; then
    echo "*** blockbear.chromium: Creating package..."
    pushd $(dirname $DES/)
    zip blockbear.chromium.zip -qr $(basename $DES/)/*
    popd
fi

echo "*** blockbear.chromium: Package done."
