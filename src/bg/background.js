// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

/*
//example of using a message handler from the inject scripts
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();
  });

chrome.contextMenus.removeAll();
chrome.contextMenus.create({
      title: "first",
      contexts: ["browser_action"],
      onclick: function() {
        alert('first');
      }
});
*/



const menuA = [
  { id: 'ItemF', act: (info, tab) => { console.log('Clicked ItemF', info, tab, info.menuItemId); alert('Clicked ItemF') } },
  { id: 'ItemG', act: (info, tab) => { console.log('Clicked ItemG', info, tab, info.menuItemId); alert('Clicked ItemG') } },
  { id: 'ItemH', act: (info, tab) => { console.log('Clicked ItemH', info, tab, info.menuItemId); alert('Clicked ItemH') } },
  { id: 'ItemI', act: (info, tab) => { console.log('Clicked ItemI', info, tab, info.menuItemId); alert('Clicked ItemI') } },
];

const menuB = [
  { id: 'ItemJ', act: (info, tab) => { console.log('Clicked ItemJ', info, tab, info.menuItemId); alert('Clicked ItemJ') } },
  { id: 'ItemK', act: (info, tab) => { console.log('Clicked ItemK', info, tab, info.menuItemId); alert('Clicked ItemK') } },
  { id: 'ItemL', act: (info, tab) => { console.log('Clicked ItemL', info, tab, info.menuItemId); alert('Clicked ItemL') } },
  { id: 'ItemM', act: (info, tab) => { console.log('Clicked ItemM', info, tab, info.menuItemId); alert('Clicked ItemM') } },
];


const rootMenu = [
  //
  // In real practice you must read chrome.contextMenus.ACTION_MENU_TOP_LEVEL_LIMIT
  //
  { id: 'ItemA', act: (info, tab) => { console.log('Clicked ItemA', info, tab, info.menuItemId); alert('Clicked ItemA') }, menu: menuA },
  { id: 'ItemB', act: (info, tab) => { console.log('Clicked ItemB', info, tab, info.menuItemId); alert('Clicked ItemB') }, menu: menuB },
  { id: 'ItemC', act: (info, tab) => { console.log('Clicked ItemC', info, tab, info.menuItemId); alert('Clicked ItemC') } },
  { id: 'ItemD', act: (info, tab) => { console.log('Clicked ItemD', info, tab, info.menuItemId); alert('Clicked ItemD') } },
  { id: 'ItemE', act: (info, tab) => { console.log('Clicked ItemE', info, tab, info.menuItemId); alert('Clicked ItemE') } },
];


const listeners = {};

const contexts = ['browser_action'];

const addMenu = (menu, root = null) => {

  for (let item of menu) {

    let {id, menu, act} = item;

    chrome.contextMenus.create({
      id: id,
      title: chrome.i18n.getMessage(id) + "_",
      contexts: contexts,
      parentId: root
    });

    if (act) {
      listeners[id] = act;
    }

    if (menu) {
      addMenu(menu, id);
    }
  }

};

addMenu(rootMenu);

chrome.contextMenus.onClicked.addListener((info, tab) => {
  console.log('Activate „chrome.contextMenus -> onClicked Listener“', info, tab);
  listeners[info.menuItemId] (info, tab);
});

/*

// Copyright (c) 2010 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// A generic onclick callback function.
function genericOnClick(info, tab) {
  console.log("item " + info.menuItemId + " was clicked");
  console.log("info: " + JSON.stringify(info));
  console.log("tab: " + JSON.stringify(tab));
}

// Create one test item for each context type.
var contexts = ["page","selection","link","editable","image","video",
                "audio"];
for (var i = 0; i < contexts.length; i++) {
  var context = contexts[i];
  var title = "Test '" + context + "' menu item";
  var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                       "onclick": genericOnClick});
  console.log("'" + context + "' item:" + id);
}


// Create a parent item and two children.
var parent = chrome.contextMenus.create({"title": "Test parent item"});
var child1 = chrome.contextMenus.create(
  {"title": "Child 1", "parentId": parent, "onclick": genericOnClick});
var child2 = chrome.contextMenus.create(
  {"title": "Child 2", "parentId": parent, "onclick": genericOnClick});
console.log("parent:" + parent + " child1:" + child1 + " child2:" + child2);


// Create some radio items.
function radioOnClick(info, tab) {
  console.log("radio item " + info.menuItemId +
              " was clicked (previous checked state was "  +
              info.wasChecked + ")");
}
var radio1 = chrome.contextMenus.create({"title": "Radio 1", "type": "radio",
                                         "onclick":radioOnClick});
var radio2 = chrome.contextMenus.create({"title": "Radio 2", "type": "radio",
                                         "onclick":radioOnClick});
console.log("radio1:" + radio1 + " radio2:" + radio2);


// Create some checkbox items.
function checkboxOnClick(info, tab) {
  console.log(JSON.stringify(info));
  console.log("checkbox item " + info.menuItemId +
              " was clicked, state is now: " + info.checked +
              "(previous state was " + info.wasChecked + ")");

}
var checkbox1 = chrome.contextMenus.create(
  {"title": "Checkbox1", "type": "checkbox", "onclick":checkboxOnClick});
var checkbox2 = chrome.contextMenus.create(
  {"title": "Checkbox2", "type": "checkbox", "onclick":checkboxOnClick});
console.log("checkbox1:" + checkbox1 + " checkbox2:" + checkbox2);


// Intentionally create an invalid item, to show off error checking in the
// create callback.
console.log("About to try creating an invalid item - an error about " +
            "item 999 should show up");
chrome.contextMenus.create({"title": "Oops", "parentId":999}, function() {
  if (chrome.extension.lastError) {
    console.log("Got expected error: " + chrome.extension.lastError.message);
  }
});
*/