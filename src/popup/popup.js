'use strict';

// var elements = document.getElementsByClassName("blockdice");
// element.forEach(e => e.onclick = function (element) {
//   console.log("coucou");
//   if (element.parent.classList.contains("open")) {
//     element.parent.classList.remove("open");
//   } else {
//     element.parent.classList.add("open");
//   }
// });

function hookButton(name) {
  document.getElementById(name)
    .onclick = element => sendMessage({ action: name })
}

// Hooks "connect" and "disconnect" buttons to injected JS
hookButton('connect');
hookButton('showModifier');
hookButton('hideModifier');
//hookButton('disconnect');

function showText(txt) {
  document.getElementById('text').innerHTML = txt;
}

// Send message to injected JS
function sendMessage(data, responseCallback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
    chrome.tabs.sendMessage(tabs[0].id, data, responseCallback));
}

// Listen on messages from injected JS
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "showText")
    showText(request.text);
  else if (request.action == "modifierChanged") {
    // Store the modifier value when changed from floating box
    chrome.storage.sync.set({ modifier: request.modifier });
  }
});

// Inject code in website
// We need to be running in the webpage context to have access to the bluetooth stack
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  // First inject the theme detector
  chrome.tabs.executeScript(
    tabs[0].id,
    { file: "src/content/theme-detector.js" },
    _ => {
      // Then inject the modifier box module
      chrome.tabs.executeScript(
        tabs[0].id,
        { file: "src/content/modifierBox.js" },
        _ => {
          // Finally inject the main roll20 script
          chrome.tabs.executeScript(
            tabs[0].id,
            { file: "src/content/roll20.js" },
            _ => {
              sendMessage({ action: "getStatus" });
              chrome.storage.sync.get('modifier', data => sendMessage({ action: "setModifier", modifier: data.modifier || "0" }));
            })
        })
    })
});
