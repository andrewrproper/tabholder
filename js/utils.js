
export const setFaviconToChar = (iconCharString, iconFG, iconBG, strokeWidth, rotation) => {
  if ( ! strokeWidth ) strokeWidth = 0;
  if ( ! rotation ) rotation = 0;

  // transform="rotate(-10 50 100)
  // transform="rotate(45)

  //console.debug('set icon svg', iconCharString);
  //  <rect x='0' y='0' width='100%' height='100%' fill='white'></rect>
  //  <rect x='3%' y='3%' width='94%' height='94%' fill='black'></rect>
  const SVGString = `<svg 
    xmlns='http://www.w3.org/2000/svg' 
    viewBox='0 0 128 128'
    >
    <rect x='0' y='0' width='128' height='128' fill='${iconFG}'></rect>
    <rect x='4' y='4' width='120' height='120' fill='${iconBG}'></rect>
    <text 
      transform='rotate(${rotation}, 64, 64)'
      x='50%' 
      y='57%' 
      dominant-baseline='middle' 
      text-anchor='middle'
      font-size='108px' 
      fill='${iconFG}'
      stroke='${iconFG}'
      stroke-width='${strokeWidth}'
    >${iconCharString}</text>
    </svg>`;

  const newSVGDataImage = `data:image/svg+xml,${SVGString}`;

  const favIcon = document.querySelector("link[rel~='icon']");
  favIcon.href = newSVGDataImage;

  const iconSVG = document.getElementById('icon-svg');
  iconSVG.src = newSVGDataImage;
  iconSVG.setAttribute("svg_string", SVGString)
}


export const openDuplicateWindow = () => {
  // Get current URL and open a new window/tab with same URL.
  window.open(window.location.href);
}


export const openBlankWindow = () => {
  // Get current URL and open a new window/tab with same URL.
  let thisURL = new URL(window.location.href);
  thisURL.search = ""; // clear search string
  window.open(thisURL);
}




export default {};
