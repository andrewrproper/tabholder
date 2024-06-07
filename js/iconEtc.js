
import { 
  unicodeCharNums,
  SVGColors,
  iconsByType,
} from './init.js';

import {
  applySettings,
} from './settings.js';


function showIconDialog(type, buttonId) {
  const iconSelectDialog = document.getElementById("icon-select-dialog");
  iconSelectDialog.setAttribute('type', type);
  iconSelectDialog.removeAttribute('buttonId');
  iconSelectDialog.setAttribute('buttonId', buttonId);
  iconSelectDialog.classList.remove('hidden');
}




function showDialogTab(event, tabId) {
  const tabs = document.querySelectorAll(".tab-button");
  tabs.forEach((element, index) => {
    element.classList.remove("tab-button-selected");
  });

  const thisTabButton = event.target;
  if ( thisTabButton ) thisTabButton.classList.add("tab-button-selected");

  const tabsContents = document.querySelectorAll(".tab-content");
  tabsContents.forEach((element, index) => {
    element.classList.add("hidden");
  });

  //console.debug("show tab content with id:", tabId);
  const tabContent = document.getElementById(tabId);
  //console.debug("show tab content with id - tabContent", tabContent);
  if ( tabContent ) tabContent.classList.remove("hidden");
}


function dialogIconButtonClicked (event) {
  const targetE = event.target;

  let none = false;
  if ( targetE?.attributes?.none ) none = true;

  let newCharNum = 0;
  if ( ! none ) newCharNum = targetE?.attributes?.charNum?.value;
  if ( ! newCharNum ) none = true;

  const iconSelectDialog = document.getElementById("icon-select-dialog");
  const type = iconSelectDialog.attributes.type.value;
  const buttonId = iconSelectDialog.attributes.buttonId.value;

  //console.debug("dialogIconButtonClicked", {type: type, buttonId: buttonId, newCharNum: newCharNum});

  if ( ! none && ! newCharNum ) {
    console.error("failed to get newCharNum from iconSelectDialog");
  } else if ( ! type ) {
    console.error("failed to get type from iconSelectDialog");
  } else if ( type == "icon") {
    if ( ! none ) {
      settings.iconCharCode = newCharNum;
      applySettings();

      const button = document.getElementById(buttonId);
      button.innerHTML = `&#${newCharNum};`;
    }
  } else if ( type == 'titlePrefix') {

    const button = document.getElementById(buttonId);
    if ( none ) {
      button.innerHTML = '';
      settings.titlePrefixChars = [];
    } else {
      button.innerHTML = `&#${newCharNum};`;
      settings.titlePrefixChars = [newCharNum];
    }
    applySettings();

  } else if ( type == 'titleSuffix') {

    const button = document.getElementById(buttonId);
    if ( none ) {
      button.innerHTML = '';
      settings.titleSuffixChars = [];
    } else {
      button.innerHTML = `&#${newCharNum};`;
      settings.titleSuffixChars = [newCharNum];
    }
    applySettings();

  }

  // close icon select dialog
  iconSelectDialog.classList.add('hidden');
}



function initIconDialog (charNumsList, charNumByType) {
  let tabs = [];
  let tabsContents = [];
  let keys = Object.keys(charNumByType);
  keys.forEach((key, index) => {
    let selected = "";
    if ( index <= 0 ) selected = "tab-button-selected";
 
    const tabId = `icon-dialog-tab-${index}`;
    tabs.push(`<button class="tab-button ${selected}" tabId="${tabId}">${key}</button>`);

    let buttonCells = charNumByType[key].map(
      (charNum) => `<button class="flex-cell icon-button choose-icon-button"
        charNum="${charNum}">&#${charNum};</button>`
    );

    let hidden = "";
    if ( index > 0 ) hidden = "hidden";
 
    let html = `
    <div class="flex-container tab-content ${hidden}" id="${tabId}">
    <button none="true" class="icon-button choose-icon-button">none</button>
    ${buttonCells.join("")}
    </div>
    `;
  
    tabsContents.push(html);

  });

  const modalContent = document.getElementById("icon-select-content");

  modalContent.innerHTML = `
  <div class="tabs">
  ${tabs.join("")}
  </div>
  <div class="tabs-contents">
  ${tabsContents.join("")}
  </div>
  `;

  const foundTabButtons = document.querySelectorAll(".tab-button");
  foundTabButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => {
      const clicked = event.target;
      const tabId = clicked.attributes.tabId.value;
      showDialogTab(event, tabId);
    });
  })

  const foundIconButtons = document.querySelectorAll(".choose-icon-button");
  foundIconButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => dialogIconButtonClicked(event));
  });

}









function showColorDialog(type, buttonId) {
  const colorDialog = document.getElementById("color-select-dialog");
  colorDialog.setAttribute('type', type);
  colorDialog.removeAttribute('buttonId');
  colorDialog.setAttribute('buttonId', buttonId);
  colorDialog.classList.remove('hidden');
}






function dialogColorButtonClicked(event) {
  const targetE = event.target;

  const newColor = targetE.attributes.color.value;

  const colorSelectDialog = document.getElementById("color-select-dialog");
  const type = colorSelectDialog.attributes.type.value;
  const buttonId = colorSelectDialog.attributes.buttonId.value;

  if ( ! newColor ) {
    console.error("failed to get newColor from colorSelectDialog");
  } else if ( ! type ) {
    console.error("failed to get type from colorSelectDialog");
  } else if ( type == "FG") {
    const button = document.getElementById(buttonId);
    button.style.backgroundColor = newColor;

    settings.iconFG = newColor;
    applySettings();
  } else if ( type == "BG") {
    const button = document.getElementById(buttonId);
    button.style.backgroundColor = newColor;

    settings.iconBG = newColor;
    applySettings();
  }

  // close icon select dialog
  colorSelectDialog.classList.add('hidden');
}


function initColorDialog (colorsList) {
  let buttonCells = colorsList.map(
    (color) => `<button class="flex-cell color-button choose-color-button" 
      color="${color}" 
      style=" background-color: ${color}; "
      >${color}</button>`
  );
  const modalContent = document.getElementById("color-select-content");
  modalContent.innerHTML = `
  <div class="flex-container">
  ${buttonCells.join("")}
  </div>
  `;

  const foundColorButtons = document.querySelectorAll(".choose-color-button");
  foundColorButtons.forEach((button, index) => {
    button.addEventListener('click', (event) => dialogColorButtonClicked(event));
  });


}






const rotationIncrement = (rotationSelect, rotationAdjust) => {
  let newValue = parseInt(settings.iconRotation) + parseInt(rotationAdjust);
  if ( Number.isInteger(newValue) ) {
    if ( newValue > 360 ) newValue = parseInt( newValue - 360 ) || 360;
    rotationSelect.value = newValue;
    settings.iconRotation = newValue;
    applySettings();
  }
}

const rotationDecrement = (rotationSelect, rotationAdjust) => {
  let newValue = parseInt(settings.iconRotation) - parseInt(rotationAdjust);
  if ( Number.isInteger(newValue) ) {
    if ( newValue < 0 ) newValue = parseInt( newValue + 360 ) || 0;
    rotationSelect.value = newValue;
    settings.iconRotation = newValue;
    applySettings();
  }
}











export const initIcon = () => {
  let closeButton = document.getElementById("icon-select-dialog-close");
  if ( closeButton ) {
    closeButton.addEventListener('click', () =>{
      const iconSelectDialog = document.getElementById("icon-select-dialog");
      if ( iconSelectDialog ) iconSelectDialog.classList.add('hidden');
    });
  }
  const openIconDialogButton = document.getElementById("open-icon-select");
  if ( openIconDialogButton ) {
    openIconDialogButton.innerHTML = `&#${settings.iconCharCode};`
    openIconDialogButton.addEventListener('click', () => {
      showIconDialog('icon', 'open-icon-select');
    });
  }
  

  initIconDialog(unicodeCharNums, iconsByType);

  // ============ show icon ==============

  const iconSVG = document.getElementById("icon-svg");
  if ( iconSVG ) {
    iconSVG.addEventListener('click', (event) => {
      const svgElement = event.target;
      const SVGString = svgElement.attributes.svg_string.value;

      const blob = new Blob([SVGString], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      open(url);
    })
  }

  // ============ stroke width ==============

  const strokeWidthRange = document.getElementById("icon-stroke-width");
  const strokeWidthRangeValue = document.getElementById("icon-stroke-width-value");
  if ( strokeWidthRange ) {
    if ( settings.iconStrokeWidth !== undefined ) strokeWidthRange.value = settings.iconStrokeWidth;
    strokeWidthRange.addEventListener('input', (event) => {
      const newWidth = event.target.value;
      if ( newWidth ) {
        settings.iconStrokeWidth = newWidth;
        applySettings();
        if ( strokeWidthRangeValue ) strokeWidthRangeValue.innerHTML = newWidth;
      }
    });
  }
  if ( strokeWidthRangeValue ) strokeWidthRangeValue.innerHTML = settings.iconStrokeWidth;

  // ============ rotation ==============

  /*
  window.addEventListener('keydown', (event) => {
    if ( ! event.target?.attributes?.id?.value ) {
      //console.log("window keydown:", event);
      if ( event.key == "ArrowUp") rotationDecrement(rotationSelect, conf.rotationAdjust);
      else if ( event.key == "ArrowDown") rotationIncrement(rotationSelect, conf.rotationAdjust);
    }
  });
  */

  const rotationRange = document.getElementById("icon-rotation-range");
  const rotationRangeValue = document.getElementById("icon-rotation-range-value");
  if ( rotationRange ) {
    if ( settings.iconRotation !== undefined ) rotationRange.value = settings.iconRotation;
    rotationRange.addEventListener('input', (event) => {
      const newValue = parseInt(event.target.value);
      settings.iconRotation = newValue;
      applySettings();
      if ( rotationRangeValue ) rotationRangeValue.innerHTML = newValue;
    });
  }
  if ( rotationRangeValue ) rotationRangeValue.innerHTML = settings.iconRotation;
 


  // ============ color ==============

  initColorDialog(SVGColors);

  const openFGColorButton = document.getElementById("open-fg-color-select");
  if ( openFGColorButton ) {
    openFGColorButton.style.backgroundColor = settings.iconFG;
    openFGColorButton.addEventListener('click', () => {
      showColorDialog('FG', 'open-fg-color-select');
    });
  }
  
  const openBGColorButton = document.getElementById("open-bg-color-select");
  if ( openBGColorButton ) {
    openBGColorButton.style.backgroundColor = settings.iconBG;
    openBGColorButton.addEventListener('click', () => {
      showColorDialog('BG', 'open-bg-color-select');
    });
  }
 
  closeButton = document.getElementById("color-select-dialog-close");
  if ( closeButton ) {
    closeButton.addEventListener('click', () =>{
      const colorSelectDialog = document.getElementById("color-select-dialog");
      if ( colorSelectDialog ) colorSelectDialog.classList.add('hidden');
    });
  }
 
}


export const initTitle = () => {

  let targetId = "open-title-prefix-icon-select";
  const titlePrefixButton = document.getElementById(targetId);
  if ( titlePrefixButton ) {
    if ( settings.titlePrefixChars !== undefined ) {
      titlePrefixButton.innerHTML = String.fromCodePoint(...settings.titlePrefixChars);
    }
    titlePrefixButton.addEventListener('click', () => {
      showIconDialog('titlePrefix', "open-title-prefix-icon-select");
    });
  }

  targetId = "open-title-suffix-icon-select";
  const titleSuffixButton = document.getElementById(targetId);
  if ( titleSuffixButton ) {
    if ( settings.titleSuffixChars !== undefined ) {
      titleSuffixButton.innerHTML = String.fromCodePoint(...settings.titleSuffixChars);
    }
    titleSuffixButton.addEventListener('click', () => {
      showIconDialog('titleSuffix', "open-title-suffix-icon-select");
    });
  }


  const titleSizeRange = document.getElementById("title-size");
  const titleSizeValue = document.getElementById("title-size-value");
  if ( titleSizeRange ) {
    if ( settings.titleSize !== undefined ) titleSizeRange.value = settings.titleSize;
    titleSizeRange.addEventListener('input', (event) => {
      const newValue = event.target.value;
      if ( newValue ) {
        settings.titleSize = newValue;
        applySettings();
        if ( titleSizeValue ) titleSizeValue.innerHTML = newValue;
      }
    });
  }
  if ( titleSizeValue ) titleSizeValue.innerHTML = settings.titleSize;


 
}
