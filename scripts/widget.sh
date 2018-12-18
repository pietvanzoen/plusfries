#!/bin/sh
# Compress and minify widget
set -e

OUT_FILE="public/plusfries.js"
mkdir -p "$(dirname $OUT_FILE)"
BIN="./node_modules/.bin"

echo "start minifying..."
CSS="$($BIN/uglifycss widget/plusfries.css)"
ES5="$($BIN/babel widget/plusfries.js)"
COMPACT="$(echo "$ES5" | $BIN/terser -m -c)"
echo "$COMPACT" | sed "s/PLUS_FRIES_CSS/${CSS}/g" >$OUT_FILE
echo "minification done!"
