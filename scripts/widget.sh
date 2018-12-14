#!/bin/bash
# Compress and minify widget
set -e

TEMP_DIR="$(mktemp -d)"
mkdir -p ./public

echo "start minifying..."
# minify css
npx postcss widget/plusfries.css >$TEMP_DIR/plusfries.css
# compile and minify js app
npx babel widget/plusfries.js --out-file $TEMP_DIR/plusfries.js
npx terser $TEMP_DIR/plusfries.js -o $TEMP_DIR/plusfries.js -m -c
# inject css
CSS=$(cat $TEMP_DIR/plusfries.css)
sed "s/PLUS_FRIES_CSS/${CSS}/g" $TEMP_DIR/plusfries.js >public/plusfries.js
echo "minification done!"
