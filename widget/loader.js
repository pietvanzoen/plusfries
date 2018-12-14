(function(doc, s) {
  window.PLSFRS = 'PLUS_FRIES_URL';
  const URL = window.PLSFRS + '/plusfries.js';
  const script = doc.createElement(s);
  const scripts = doc.getElementsByTagName(s)[0];

  script.async = true;
  script.src = URL;
  scripts.parentNode.insertBefore(script, scripts);
}(document, 'script'));
