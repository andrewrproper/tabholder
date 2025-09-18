
import './globals.js';

import {
  openDuplicateWindow,
  openBlankWindow,
} from './utils.js';

import {
  initIcon,
  initTitle,
} from './iconEtc.js';

import {
  addURLToSettings,
  removeURLFromSettings,
  applySettings,
  initContentHeight,
} from './settings.js';

export default {};




function setTitleTo (title, conf) {
  settings.title = title;

  applySettings();
}





function titleInputChanged (input, conf) {
  let title = input.value;
  if ( title !== undefined && title !== null) {
    //console.debug("found title from text input: "+title);
    setTitleTo(title, conf);
  } else {
    console.debug("no defined non-null title found from text input");
  }
}


const isSet = (value) => value !== undefined && value !== null && value !== "";

function initSettingsFromURLParams () {
  // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  const params = new Proxy(
    new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    }
  );

  let paramsTH = params.th;
  let paramsT = params.t;
  let paramsTS = params.ts;
  let paramsTPC = params.tpc;
  let paramsTSC = params.tsc;
  let paramI = params.i;
  let paramIFG = params.ifg;
  let paramIBG = params.ibg;
  let paramISW = parseInt(params.isw) || 0;
  let paramIR = parseInt(params.ir) || 0;
  let paramData = params.d;

  if ( isSet(paramsTH)  ) settings.theme = paramsTH;
  if ( isSet(paramsT)   ) settings.title = paramsT;
  if ( isSet(paramsTS)  ) settings.titleSize = paramsTS;
  if ( isSet(paramsTPC) ) settings.titlePrefixChars = paramsTPC.split(',');
  if ( isSet(paramsTSC) ) settings.titleSuffixChars = paramsTSC.split(',');
  if ( isSet(paramI)    ) settings.iconCharCode = paramI;
  if ( isSet(paramIFG)  ) settings.iconFG = paramIFG;
  if ( isSet(paramIBG)  ) settings.iconBG = paramIBG;
  if ( isSet(paramISW)  ) settings.iconStrokeWidth = paramISW;
  if ( isSet(paramIR)   ) settings.iconRotation = paramIR;
  if ( isSet(paramData)    ) {
    console.debug('searchParam "d" content:', paramData)
    try {
      //const base64 = decodeURIComponent(paramData);
      //console.debug("base64 from paramData:", base64);
      //const binaryString = atob(base64);
      //console.debug("string from atob(base64):", binaryString);

      //const utf8Encoded = binaryString
      //  .split('')
      //  .reduce((acc, next) =>
      //    [...acc, next.charCodeAt(0)],
      //    []
      //  );
      //console.debug("utf8Encoded:", utf8Encoded);

      //const utf8Encoded = String.toCharCode(binaryString);
      //const linksJSON = new TextDecoder().decode(utf8Encoded);
      //const data = JSON.parse(linksJSON);

      const jsonText = decodeURIComponent(paramData);
      const data = JSON.parse(jsonText);
      console.debug('data from JSON Text from "d" param:', data);

      settings.links = [ ...data.l];


      // apply settings.links to display links in UI
      for (const linkURL of settings.links) {
        addURLToListAsync(linkURL);
      }

    }
    catch (error) {
      console.error('failed to parse searchParam "d" content:', { paramData: paramData, error: error})
    }
  }
}


function initSetTitleInput () {
  let input = document.getElementById("set-title");
  if ( settings.title ) input.value = settings.title;
  if ( input ) {
    input.addEventListener('keyup',  function() { titleInputChanged(input, conf); });
    input.addEventListener('change', function() { titleInputChanged(input, conf); });
    input.focus();
  }
}



function initOpenBlankButton () {
  let button = document.getElementById("open-button");
  if ( button ) {
    button.addEventListener('click',  function(event) { 
      event.preventDefault(); // Cancel the default action, if needed
      openBlankWindow();
    });

    // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
    button.addEventListener('keypress',  function(event) { 
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Cancel the default action, if needed
        openBlankWindow();
      }
    }); 
  }
}


function initOpenDuplicateButton () {
  let button = document.getElementById("open-button-same-title");
  if ( button ) {
    button.addEventListener('click',  function(event) { 
      event.preventDefault(); // Cancel the default action, if needed
      openDuplicateWindow();
    });

    // https://www.w3schools.com/howto/howto_js_trigger_button_enter.asp
    button.addEventListener('keypress',  function(event) { 
      console.debug("key:", event.key);
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Cancel the default action, if needed
        openDuplicateWindow();
      }
    }); 
  }
}


async function getURLDataAsync (inURL)
{
  const result = {
    success: false,
  };

  try {
    const response = await fetch(inURL);
    if ( response.ok) {
      const htmlContent = await response.text();

      const parser = new DOMParser();
      let htmlDoc = "";
      try {
        // firefox
        htmlDoc = parser.parseFromString(htmlContent, 'text/html');
      } catch {
        // chrome
        htmlDoc = parser.parseFromString(htmlContent, 'text/xml');
      }

      if ( ! htmlDoc ) {
        alert('failed to parse htmlContent');
        return result;
      }

      const headElements = htmlDoc.getElementsByTagName('head');
      const titleElements = headElements[0]?.getElementsByTagName('title');

      result.title = titleElements[0]?.textContent;

      /*
        <meta property="og:image" content="https://introvertdear.com/wp-content/uploads/2023/08/what-ive-learned-about-being-a-quiet-introvert-in-an-extroverted-workplace.jpg" />
      */
      const metaOgImage = headElements[0]?.querySelector('meta[property="og:image"]');
      if ( metaOgImage ) {
        const imageHref = metaOgImage.content;
        result.headerImageHref = imageHref;
      }

      result.success = true;
    }
  }
  catch {
    // often a CORS error, but we want to continue
  }

  return result;
}

async function addURLToListAsync (inURL) {
  const ulE = document.getElementById("links-list");
  if ( ! ulE ) {
    alert("failed to find #links-list");
    return;
  } 

  const aE = document.createElement('a');
  aE.href = inURL.toString();
  aE.target = "_blank";
  aE.rel = "noopener";

  let urlData = await getURLDataAsync(inURL);
  if ( ! urlData || ! urlData.success ) {
    urlData = {};
  }

  const useTitle = urlData.title ?? inURL.toString();
  aE.title = useTitle;

  let anchorContent = useTitle;
  if ( urlData.headerImageHref ) {
    const imgE = document.createElement('img');
    imgE.src = urlData.headerImageHref;
    anchorContent = imgE
  }
  aE.append(anchorContent);

  let buttonE = document.createElement("button");
  buttonE.innerHTML = "x";
  buttonE.addEventListener('click', deleteLink);

//  let textNode = document.createTextNode("\\21d7");
  let spanE = document.createElement("span");
  spanE.className = "popoutCharacter";
  spanE.innerHTML = "&#8663;";
    
  let liE = document.createElement("li");
  liE.append(buttonE);
  liE.append(spanE);
  liE.append(aE);


  ulE.append(liE);
}


function deleteLink (event) {
  const liE = event.target.parentElement;
  const aE = liE.querySelector('a');
  const linkHref = aE.href;
  console.debug('deleteLink: '+linkHref);
  if ( linkHref && liE ) {
    removeURLFromSettings(new URL(linkHref));
    liE.remove();
  }
}


function initAddLinkButton () {
  let button = document.getElementById("add-link");
  if ( button ) {
    button.addEventListener("click", async function (event) {
      const clipText = await navigator.clipboard.readText();

      var inURL = undefined;
      try {
        inURL = new URL(clipText);

      } catch (error) {
        console.debug('pasted text is not a URL', error);
      }

      if ( ! inURL ) {
        alert("No link found in clipboard");
      } else {
        addURLToSettings(inURL);
        await addURLToListAsync(inURL);
      }
    });
  }
}





function initTheme () {
  const lightIconCharHTML = "&#128526;"
  const darkIconCharHTML = "&#127769;"

  const setLightTheme = (body) => {
    // change to light theme
    body.classList.add("light-theme");
    body.classList.remove("dark-theme");
    themeSwitchButton.innerHTML = lightIconCharHTML + " light";
    settings.theme = "light";
  }
  const setDarkTheme = (body) => {
    body.classList.add("dark-theme");
    body.classList.remove("light-theme");
    themeSwitchButton.innerHTML = darkIconCharHTML + " dark";
    settings.theme = "dark";
  }

  const themeSwitchButton = document.getElementById("theme-switch")
  const body = document.querySelector("body");
  if ( themeSwitchButton !== undefined && body !== undefined ) {
    themeSwitchButton.addEventListener('click', (event) => {
      if ( settings.theme == "dark") {
        setLightTheme(body);
      } else {
        setDarkTheme(body);
      }
      applySettings();
    });
  }

  // dark is default
  if ( settings.theme == "light") setLightTheme(body);
}





function init () {
  initSettingsFromURLParams();

  initTheme();
  initSetTitleInput();
  initOpenBlankButton();
  initOpenDuplicateButton();

  initAddLinkButton ();

  initIcon();
  initTitle();

  applySettings();
}


addEventListener("DOMContentLoaded", (event) => {
  init();
});

addEventListener("resize", () => {
  initContentHeight();
});

