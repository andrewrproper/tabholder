
import {
  setFaviconToChar,
} from './utils.js';



const getTitle = () => {

  let titlePrefix = "";
  if ( settings.titlePrefixChars !== undefined && settings.titlePrefixChars.length > 0 ) 
    titlePrefix = String.fromCodePoint(...settings.titlePrefixChars) + " ";

  let titleSuffix = "";
  if ( settings.titleSuffixChars !== undefined && settings.titleSuffixChars.length > 0 ) 
    titleSuffix = " " + String.fromCodePoint(...settings.titleSuffixChars);


  const linksCount = settings?.links?.length ?? 0;
  let linksText = "";
  if ( linksCount > 0 ) {
    linksText = ` (${linksCount} links)`;
  }

  const useTitle = titlePrefix + ( settings.title || "..." ) + titleSuffix;

  const titleDisplayLength = useTitle.length;

  let endDelim = "";
  const lenDiff = conf.maxTitleWithDelimLength - titleDisplayLength;
  if ( lenDiff > 0 ) {
    const repeatNum = Math.floor(lenDiff / conf.endDelimPart.length * conf.endDelimPartFactor);
    /*
    console.debug("length calc", {
      conf.maxTitleWithDelimLength: maxTitleWithDelimLength,
      titleDisplayLength: titleDisplayLength, 
      lenDiff: lenDiff, 
      repeatNum: repeatNum
    });
    */
    if ( repeatNum > 0 ) endDelim = conf.endDelimPart.repeat(repeatNum);
  }

  return { useTitle: useTitle, endDelim: endDelim, linksText: linksText };
}



export const updateURLSearchParams = (useTitle) => {
  let searchParams = new URLSearchParams(window.location.search);

  if ( settings.theme ) searchParams.set("th", settings.theme);
  else searchParams.delete("th");

  if ( settings.title ) searchParams.set("t", settings.title);
  else searchParams.delete("t");

  if ( settings.titleSize ) searchParams.set("ts", settings.titleSize);
  else searchParams.delete("ts");

  if ( settings.titlePrefixChars ) searchParams.set("tpc", settings.titlePrefixChars);
  else searchParams.delete("tpc");

  if ( settings.titleSuffixChars ) searchParams.set("tsc", settings.titleSuffixChars);
  else searchParams.delete("tsc");

  if ( settings.iconCharCode ) searchParams.set("i", settings.iconCharCode);
  else searchParams.delete("i");

  if ( settings.iconFG ) searchParams.set("ifg", settings.iconFG);
  else searchParams.delete("ifg");

  if ( settings.iconBG ) searchParams.set("ibg", settings.iconBG);
  else searchParams.delete("ibg");

  if ( settings.iconStrokeWidth ) searchParams.set("isw", settings.iconStrokeWidth);
  else searchParams.delete("isw");

  if ( settings.iconRotation ) searchParams.set("ir", settings.iconRotation);
  else searchParams.delete("ir");


  if ( settings.links ) {
    console.debug("storing settings.links:", settings.links);
    const encodeData = { 
      'l': [ ...settings.links] // convert the Set to an array
     };
    const jsonText = JSON.stringify(encodeData);
    console.debug("setting jsonText in param.d:", jsonText);

    const encodedJSON = encodeURIComponent(jsonText);
    searchParams.set('d', encodedJSON);
  }
  else searchParams.delete('d');


  let newURL = new URL(window.location.href);
  newURL.search = searchParams;

  window.history.replaceState({}, useTitle, newURL);
  //window.history.pushState({}, "", newURL);
}


export const initContentHeight = () => {
  const header = document.getElementById("header");
  const content = document.getElementById("content");
  if ( header && content ) {
    const headerHeight = header.clientHeight;
    const windowHeight = window.innerHeight;
    const newContentHeight = windowHeight - headerHeight 
      - 10; // leave room for border, margin, etc

    //console.debug("newContentHeight", newContentHeight);
    content.style.height = newContentHeight + "px";
  }
}

export const addURLToSettings = (inURL, inURLTitle, imageHref) => {
  if ( ! settings.links ) {
    settings.links = [];
  }
  settings.links.push({ 'l': inURL.toString(), 't': inURLTitle ?? '', 'i' : imageHref ?? ''});
  applySettings();
}

export const removeURLFromSettings = (inURL) => {
  if ( ! settings.links ) {
    settings.links = [];
  } else {
    settings.links = settings.links.filter(item => item.l !== inURL.toString());
  }
  applySettings();
}



export const applySettings = () => {


  // set title
  const titleData = getTitle();
  const titleElement = document.getElementById("title");
  if ( titleElement ) {
    titleElement.innerHTML = titleData.useTitle;
  }
  document.title = titleData.useTitle + titleData.endDelim + titleData.linksText;


  updateURLSearchParams(titleData.useTitle);


  // set title font size
  if ( settings.titleSize ) {
    let root = document.querySelector(':root');
    if ( root ) {
      // change value of CSS variable
      root.style.setProperty('--title-font-size', `${settings.titleSize}em`);
    }
  }


  // set favicon from iconCharString
  let iconCharString = "";
  if ( settings.iconCharCode ) {
    iconCharString = String.fromCodePoint(settings.iconCharCode);
    if ( iconCharString ) 
      setFaviconToChar(iconCharString, settings.iconFG, settings.iconBG, settings.iconStrokeWidth, settings.iconRotation);
  }


  // need to update content height in case title font size changed header height
  initContentHeight();

};
