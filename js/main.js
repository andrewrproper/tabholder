
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

  if ( isSet(paramsTH)  ) settings.theme = paramsTH;
  if ( isSet(paramsT)   ) settings.title = paramsT;
  if ( isSet(paramsTS)  ) settings.titleSize = paramsTS;
  if ( isSet(paramsTPC) ) settings.titlePrefixChars = paramsTPC.split(',');
  if ( isSet(paramsTSC) ) settings.titleSuffixChars = paramsTSC.split(',');
  if ( isSet(paramI)    ) settings.iconCharCode = paramI;
  if ( isSet(paramIFG)  ) settings.iconFG = paramIFG;
  if ( isSet(paramIBG)  ) settings.iconBG = paramIBG;
  if ( isSet(paramISW)  ) settings.iconStrokeWidth = paramISW;
  if ( isSet(paramIR)  ) settings.iconRotation = paramIR;
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

