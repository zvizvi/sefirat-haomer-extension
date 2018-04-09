/* global chrome */
var Hebcal = window.Hebcal;

function setup () {
  var count = Hebcal.HDate(new Date()).omer().toString();

  chrome.browserAction.setBadgeText({ text: count });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#666' });
  setTimeout(setup, 43200000); // 12 hours.
}
setup();
