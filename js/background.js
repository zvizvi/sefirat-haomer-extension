/* global chrome */
const moment = window.moment;
const Hebcal = window.Hebcal;

let today, todayHebrewObj, isAfterSunset, omer;

function setupHebrewDate () {
  todayHebrewObj = Hebcal.HDate(new Date(today.toISOString()));
  todayHebrewObj.setLocation(31.783, 35.233); // Jerusalem
}

function setup () {
  today = moment();
  setupHebrewDate();

  isAfterSunset = today.isAfter(todayHebrewObj.sunset());
  if (isAfterSunset) {
    today = today.add(1, 'days');
    setupHebrewDate();
  }

  omer = todayHebrewObj.omer();

  chrome.action.setBadgeText({ text: omer ? omer.toString() : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#666' });
  setTimeout(setup, 43200000); // 12 hours.
}
setup();

function setCron () {
  setTimeout(function () {
    setup();
    setCron();
  }, todayHebrewObj.sunset() - new Date());
}
setCron();
