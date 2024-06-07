

function setTitleTo (title, conf) {
  const titleDisplayLength = title.length + conf.titlePrefix.length + conf.titleSuffix.length;

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

  document.getElementById("title").innerHTML = title;

  const newDocTitle = conf.titlePrefix + title + conf.titleSuffix + " " + endDelim;
  document.title = newDocTitle;
}


function inputChanged (input, conf) {
  let title = input.value;
  if ( title !== undefined && title !== null) {
    //console.debug("found title from text input: "+title);
    setTitleTo(title || "...", conf);


    let searchParams = new URLSearchParams(window.location.search);
    if ( title ) searchParams.set("t", title);
    else searchParams.delete("t");

    let newURL = new URL(window.location.href);
    newURL.search = searchParams;

    window.history.pushState({}, "", newURL);
  } else {
    console.debug("no defined non-null title found from text input");
  }
}


function initInput (conf) {
  // https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
  const params = new Proxy(
    new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop)
    }
  );

  let input = document.getElementById("set-title");
  if ( input ) {
    let title = params.t;
    if ( title !== undefined && title !== null && title !== "" ) {
      setTitleTo(title, conf); // default
      input.value = title;
    }

    input.addEventListener('keyup',  function() { inputChanged(input, conf); });
    input.addEventListener('change', function() { inputChanged(input, conf); });

    input.focus();
  }
}


function openBlankWindow() {
  // Get current URL and open a new window/tab with same URL.
  let thisURL = new URL(window.location.href);
  thisURL.search = ""; // clear search string
  window.open(thisURL);
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


function openDuplicateWindow() {
  // Get current URL and open a new window/tab with same URL.
  window.open(window.location.href);
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


function initAbout() {

  let aboutButton = document.getElementById("about-button");
  let aboutHTML = document.getElementById("about-html");

  aboutButton.addEventListener('click', function() {
    // toggle between displayed and not displayed
    if ( aboutHTML.style.display == 'none' ) {
      aboutHTML.style.display = '';
    } else {
      aboutHTML.style.display = 'none';
    }
  });

}


function init () {
  const conf = {
    maxTitleWithDelimLength: 33, 
    endDelimPart: ' .',

    // This factor is needed because title display characters are wider than just dots.
    endDelimPartFactor: 1.7, 

    titlePrefix: "|| ",
    titleSuffix: " ||",
  };

  setTitleTo("...", conf); // default
  initInput(conf);
  initOpenBlankButton();
  initOpenDuplicateButton();
  initAbout(conf);
}


init();

