
import React from 'react';
import ReactDOM from 'react-dom';
import Drawer from './drawer';

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.color) {
    console.log("Receive color = " + msg.color);
    document.body.style.backgroundColor = msg.color;
    sendResponse("Change color to " + msg.color);
  } else {
    sendResponse("Color message is none.");
  }
});

let div = document.createElement('div')
div.id = 'drawer'
document.body.appendChild(div)

ReactDOM.render(
  <React.StrictMode>
    <Drawer />
  </React.StrictMode>,
  document.getElementById("drawer")
);