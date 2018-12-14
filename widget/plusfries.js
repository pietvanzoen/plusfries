const ENDPOINT = "//%PLUSFRIES_HOST%/plus";
const LOCATION = encodeURIComponent(window.location.href);

const puntzak = document.querySelector('#plusfries')
const frites = (num = 0) => parseInt(puntzak.dataset.counter, 10) + num
const fritesInc = () => puntzak.dataset.counter = frites(1);
const fritesDec = () => puntzak.dataset.counter = frites(-1);

injectStyles('PLUS_FRIES_CSS')
puntzak.addEventListener('click', onPlusFry);
fetch(`${ENDPOINT}/${LOCATION}`)
    .then(res => res.json())
    .then(({count}) => count)
    .then(onLoad)
    .catch(() => onLoad())

function onLoad(fries = 0) {
  puntzak.dataset.counter = fries;
  puntzak.classList.remove('loading');
  fetching = false;
}

let fetching = true;
function onPlusFry() {
  if(fetching) return;
  fritesInc();
  fetching = true;

  const method = 'POST';
  const body = new FormData();
  body.append('location', LOCATION);
  fetch(ENDPOINT, { method, body })
    .then(res => res.json())
    .then(() => fetching = false)
    .catch(() => fritesDec() && (fetching = false))
}

function injectStyles(css){
  const node = document.createElement('style');
  node.innerHTML = css;
  document.body.appendChild(node);
}
