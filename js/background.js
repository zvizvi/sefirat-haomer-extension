/* global chrome */
var Hebcal = window.Hebcal;

function setup () {
  var count = Hebcal.HDate(new Date()).omer();

  chrome.browserAction.setBadgeText({ text: count ? count.toString() : '' });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#666' });
  setTimeout(setup, 43200000); // 12 hours.
}
setup();
