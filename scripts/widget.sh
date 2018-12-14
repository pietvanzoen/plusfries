#!/bin/bash
# Compress and minify widget

set -e
echo "start minifying..."
# minify css
npx postcss widget/plusfries.css > /tmp/plusfries.css
# compile and minify js app
npx babel widget/plusfries.js --out-file /tmp/plusfries.js
npx terser /tmp/plusfries.js -o /tmp/plusfries.js -m -c
# inject css
CSS=`cat /tmp/plusfries.css`
sed "s/PLUS_FRIES_CSS/${CSS}/g" /tmp/plusfries.js > public/plusfries.js
# minify widget loader
npx terser widget/loader.js -o /tmp/loader.js -m -c
sed "s#PLUS_FRIES_URL#${PLSFRSURL}#g" /tmp/loader.js > public/loader.js
echo "minification done!"
