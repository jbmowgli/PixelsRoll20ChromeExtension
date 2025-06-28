'use strict';

function hookButton(name) {
  document.getElementById(name)
    .onclick = element => sendMessage({ action: name })
}

// Hooks "connect" and "showModifier" buttons to injected JS
hookButton('connect');
hookButton('showModifier');
hookButton('hideModifier');

function showText(txt) {
  document.getElementById('text').innerHTML = txt;
}

// Send message to injected JS
function sendMessage(data, responseCallback) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(tabs[0].id, data, responseCallback);
    }
  });
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

// Initialize popup - content scripts are automatically injected by manifest
chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
  if (tabs[0]?.id) {
    // Request initial status from the content script
    sendMessage({ action: "getStatus" });
    
    // Load and send stored modifier value
    chrome.storage.sync.get('modifier', data => {
      sendMessage({ action: "setModifier", modifier: data.modifier || "0" });
    });
  }
});
