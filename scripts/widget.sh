#!/bin/bash
# Compress and minify widget
set -e

OUT_FILE="public/plusfries.sh"
BIN="./node_modules/.bin"

echo "minifying css..."
CSS="$(time $BIN/uglifycss widget/plusfries.css)"
echo "transpiling js..."
ES5="$(time $BIN/babel widget/plusfries.js)"
echo "minifying js..."
COMPACT="$(time (echo "$ES5" | $BIN/terser -m -c))"
echo "$COMPACT" | sed "s/PLUS_FRIES_CSS/${CSS}/g" >$OUT_FILE
echo "minification done!"
