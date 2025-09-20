
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
    try {
      const jsonText = decodeURIComponent(paramData);
      const data = JSON.parse(jsonText);
      console.debug('data from JSON Text from "d" param:', data);
      settings.links = [ ...data.l];

      // display links in UI
      clearURLList();
      for (const entry of settings.links) {
        console.debug('add link to UI:', entry);
        addURLToListAsync(new URL(entry.l), entry.t, entry.i);
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


function clearURLList () {
  const listE = document.getElementById("links-list");
  listE.innerHTML = "";
}
 

async function addURLToListAsync (inURL, inURLTitle, imageHref) {
  console.debug('adding URL to UI:', { inURL: inURL?.toString(), inURLTitle: inURLTitle });
  const listE = document.getElementById("links-list");
  if ( ! listE ) {
    alert("failed to find #links-list");
    return;
  } 

  let useTitle = inURLTitle;
  if (!useTitle) useTitle = inURL.toString();

  const aE = document.createElement('a');
  aE.href = inURL.toString();
  aE.target = "_blank";
  aE.rel = "noopener";
  aE.title = useTitle;
  aE.className = "title";

  const flexItemE = document.createElement("div");
  flexItemE.className = "flex-item";

  const titleE = document.createElement("div");
  titleE.innerHTML = useTitle;
  titleE.className = "title-div";
  flexItemE.append(titleE);
  const domainText = inURL.hostname;
  if ( domainText ) {
    const domainE = document.createElement("div");
    domainE.className = "link-domain";
    domainE.innerHTML = domainText;
    flexItemE.append(domainE);
  }
  aE.append(flexItemE);


  let buttonE = document.createElement("button");
  buttonE.innerHTML = "x";
  buttonE.addEventListener('click', deleteLink);

//  let textNode = document.createTextNode("\\21d7");
  let spanE = document.createElement("span");
  spanE.className = "popoutCharacter";
  spanE.innerHTML = "&#8663;";


  let rowE = document.createElement("div");
  rowE.className = "list-row";
  rowE.append(buttonE);
  rowE.append(spanE);
  rowE.append(aE);

  const imgAE = document.createElement('a');
  imgAE.href = inURL.toString();
  imgAE.target = "_blank";
  imgAE.rel = "noopener";
  imgAE.title = useTitle;
  imgAE.className = "link-image-a";

  if ( imageHref ) {
    const imgE = document.createElement('img');
    imgE.src = imageHref;
    imgE.className = "link-image";
    imgAE.append(imgE);
  } else {
    const placeE = document.createElement('div');
    placeE.className = "link-image-placeholder";
    imgAE.append(placeE);
  }
  rowE.append(imgAE);



  let liE = document.createElement("li");
  liE.append(rowE);


  listE.append(liE);
}


function deleteLink (event) {
  const divE = event.target.parentElement;
  const liE = divE.parentElement;
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
      var inURLTitle = "";
      var imageHref = "";
      try {
        console.debug('add link: clipText:', clipText);
        const matches = clipText.match(/\[InternetShortcut\]\nURL=([^\n]+)(\nTitle=([^\n]+))(\nIconFile=([^\n]+))?/);
        console.debug('add link: matches:', matches);
        if ( matches !== null && matches.length > 0) {
          /*
          [InternetShortcut]
          URL=https://introvertdear.com/news/what-ive-learned-about-being-a-quiet-introvert-in-an-extroverted-workplace/
          Title=What I’ve Learned About Being a Quiet Introvert in an ‘Extroverted’ Workplace
          */
          const urlText = matches[1] ?? '';
          inURLTitle = matches[3] ?? '';
          imageHref = matches[5] ?? '';
          inURL = new URL(urlText);
        } else {
          inURL = new URL(clipText);
        }
      } catch (error) {
        console.debug('pasted text is not a URL', error);
      }

      if ( ! inURL ) {
        alert("No link found in clipboard");
      } else {
        addURLToSettings(inURL, inURLTitle, imageHref);
        await addURLToListAsync(inURL, inURLTitle, imageHref);
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



function initHandleLocationChange () {
  window.addEventListener('popstate', function(event) {
    console.log('URL changed via history navigation or state manipulation:', window.location.href);
    // The event object's state property contains the state object passed to pushState or replaceState
    console.log('State:', event.state); 

    // apply new URL's SearchParams to the page
    initSettingsFromURLParams();
    /* applySettings(); */ /* don't applySettings() because that will erase going forward again in browser history */
  });
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

  initHandleLocationChange();
}


addEventListener("DOMContentLoaded", (event) => {
  init();
});

addEventListener("resize", () => {
  initContentHeight();
});

