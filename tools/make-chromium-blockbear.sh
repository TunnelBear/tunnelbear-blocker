#!/bin/bash
#
# This script assumes a linux environment

echo "*** blockbear.chromium: Creating web store package"
echo "*** blockbear.chromium: Copying files"

DES=dist/build/blockbear.chromium
rm -rf $DES
mkdir -p $DES

echo "*** blockbear.chromium: bower install..."
bower install

bash ./tools/make-assets.sh $DES

#cp -R assets $DES/
#rm $DES/assets/*.sh
cp -R blockbear/css $DES/
cp -R blockbear/fonts $DES/
cp -R blockbear/images $DES/
cp -R blockbear/js $DES/
cp -R blockbear/lib $DES/
cp -R blockbear/_locales $DES/
cp blockbear/*.html $DES/
cp platform/chromium/blockbear/*.js $DES/js/
cp -R platform/chromium/blockbear/images $DES/
cp platform/chromium/blockbear/*.html $DES/
cp platform/chromium/blockbear/*.json $DES/
#cp LICENSE.txt $DES/

cp bower_components/knockout/dist/knockout.js $DES/js

if [ "$1" = all ]; then
    echo "*** blockbear.chromium: Creating package..."
    pushd $(dirname $DES/)
    zip blockbear.chromium.zip -qr $(basename $DES/)/*
    popd
fi

echo "*** blockbear.chromium: Package done."
